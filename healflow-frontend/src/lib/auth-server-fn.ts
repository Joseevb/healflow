import { createServerFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { redirect } from "@tanstack/react-router";
import { Effect } from "effect";

import { apiKeyConfig } from "./api-key.config";
import { attempt } from "@/lib/attempt";
import { auth } from "@/lib/auth";
import { authMiddleware } from "@/lib/auth-middleware";
import { signUpSession } from "@/schemas/sign-up-session.schema";
import { useSignUpSession } from "@/server/session";
import { UserRegistrationService } from "@/services/user-registration.service";
import { validateUser } from "@/client";

export const getUserId = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(({ context }) => context.user.id);

export const getJwt = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(({ context }) => context.jwt);

export const createUser = createServerFn({ method: "POST" })
  .inputValidator(signUpSession)
  .handler(async ({ data }) => {
    // TODO: Implement this
    async function storeImage(file: File) {
      const imageName = file.name.replace(/\.[^/.]+$/, "");
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return imageName;
    }

    const session = await useSignUpSession();
    const isSocialSignOn =
      data.state === "social-sign-on" || !!data.createdUserId || !!session.data.createdUserId;

    const account = data.accountData || session.data.accountData;
    if (!account && !isSocialSignOn) {
      throw new Error("No account data");
    }

    switch (data.state) {
      case "email": {
        if (data.accountData?.profileImage) {
          const imageName = await storeImage(data.accountData.profileImage);
          data.accountData.profileImageRef = imageName;
        }

        await session.update({
          accountData: data.accountData,
          state: "user-data",
        });
        throw redirect({
          to: "/auth/sign-up/user-data",
        });
      }

      case "social-sign-on":
      case "user-data": {
        console.debug({ state: data.state });
        if (!data.userData) {
          throw redirect({
            to: "/auth/sign-up/user-data",
          });
        }

        await session.update({
          ...session.data,
          userData: data.userData,
          state: "payment-info",
        });
        throw redirect({
          to: "/auth/sign-up/payment-info",
        });
      }
      case "payment-info": {
        const userData = data.userData || session.data.userData;
        const accountData = data.accountData || session.data.accountData;
        const createdUserId = data.createdUserId || session.data.createdUserId;

        if (!userData) {
          throw redirect({
            to: "/auth/sign-up/user-data",
          });
        }
        if (!data.paymentInfo) {
          throw redirect({
            to: "/auth/sign-up/payment-info",
          });
        }

        if (isSocialSignOn) {
          if (!accountData) {
            throw redirect({
              to: "/auth/sign-up",
            });
          }

          const userId = createdUserId!;

          console.log("[Social Sign-On] Starting user validation and provisioning for:", userId);

          // Check if user already exists in the database
          const { data: validationResult, error: validationError } = await attempt(async () => {
            const apiKey = await Effect.runPromise(apiKeyConfig.getKey());
            const headerName = await Effect.runPromise(apiKeyConfig.getHeaderName());

            console.log("[Social Sign-On] Calling validateUser API");

            return await validateUser({
              body: { ids: [userId] },
              headers: {
                [headerName]: apiKey,
              },
            });
          });

          // Log the validation response for debugging
          console.log("[Social Sign-On] Validation check result:", {
            userId,
            status: validationResult?.response.status,
            hasValidationError: !!validationError,
            validationError: validationError?.message || null,
            hasApiError: !!validationResult?.error,
            apiError: validationResult?.error || null,
          });

          // Determine if we should provision based on validation result
          let shouldProvision = false;

          // If validation call itself failed (auth error, network error, etc.), treat as new user
          if (validationError) {
            console.warn(
              "[Social Sign-On] Validation API call failed, assuming new user and proceeding with provisioning:",
              validationError.message,
            );
            shouldProvision = true;
          }
          // If validation succeeds (status 200), user already exists - skip provisioning
          else if (validationResult.response.status === 200) {
            console.log(
              "[Social Sign-On] User already exists in database, skipping provisioning:",
              userId,
            );
            shouldProvision = false;
          }
          // If validation returns 400, user doesn't exist - provision
          else if (validationResult.response.status === 400) {
            console.log(
              "[Social Sign-On] User doesn't exist in database (400), proceeding with provisioning:",
              userId,
            );
            shouldProvision = true;
          }
          // Handle authentication/authorization errors
          else if (
            validationResult.response.status === 401 ||
            validationResult.response.status === 403
          ) {
            console.error(
              "[Social Sign-On] Authentication/Authorization error during validation:",
              {
                status: validationResult.response.status,
                error: validationResult.error,
              },
            );
            console.log("[Social Sign-On] Proceeding with provisioning attempt despite auth error");
            shouldProvision = true;
          }
          // Handle other unexpected statuses
          else {
            console.error("[Social Sign-On] Unexpected validation response:", {
              status: validationResult.response.status,
              error: validationResult.error,
            });
            console.log("[Social Sign-On] Proceeding with provisioning as fallback");
            shouldProvision = true;
          }

          // If user already exists, skip provisioning
          if (!shouldProvision) {
            console.log("[Social Sign-On] Skipping provisioning, redirecting to dashboard");

            await session.update({
              paymentInfo: data.paymentInfo,
              state: "success",
            });

            await session.clear();
            throw redirect({
              to: "/dashboard",
            });
          }

          // User doesn't exist or validation failed, proceed with provisioning
          console.log("[Social Sign-On] Starting provisioning for user:", userId);

          const { error: provisionError } = await attempt(async () => {
            const service = new UserRegistrationService(apiKeyConfig);
            await Effect.runPromise(
              service.post({
                user_id: userId,
                email: accountData.email,
                specialist_id: userData.primaryCareSpecialist,
              }),
            );
          });

          console.log("[Social Sign-On] Provision result:", {
            userId,
            success: !provisionError,
            error: provisionError?.message || null,
          });

          if (provisionError) {
            console.error(
              "[Social Sign-On] Provisioning failed, rolling back user:",
              provisionError,
            );
            const headers = getRequestHeaders();

            await attempt(async () => {
              await auth.api.removeUser({
                body: { userId },
                headers,
              });
            });

            await session.clear();
            throw redirect({
              to: "/auth/sign-up",
            });
          }

          console.log("[Social Sign-On] Provisioning successful, redirecting to dashboard");

          await session.update({
            paymentInfo: data.paymentInfo,
            state: "success",
          });

          await session.clear();
          throw redirect({
            to: "/dashboard",
          });
        }

        // Regular email sign-up flow
        if (!accountData || !accountData.password) {
          throw redirect({
            to: "/auth/sign-up",
          });
        }

        const { password, firstName, lastName, email, profileImageRef } = accountData;

        const { data: res, error } = await attempt(
          async () =>
            await auth.api.signUpEmail({
              body: {
                name: `${firstName} ${lastName}`,
                email: email,
                password: password,
                image: profileImageRef,
              },
            }),
        );

        console.log({ res });
        console.log({ error });

        await session.update({
          paymentInfo: data.paymentInfo,
          state: "success",
        });

        throw redirect({
          to: "/dashboard",
        });
      }
    }
  });

export const getSessionData = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async () => {
    const session = await useSignUpSession();
    return session.data;
  });
