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

          const { error } = await attempt(async () => {
            const service = new UserRegistrationService(apiKeyConfig);
            // TODO: add payment and user data
            await Effect.runPromise(
              service.post({
                user_id: userId,
                email: accountData.email,
                specialist_id: userData.primaryCareSpecialist,
              }),
            );
          });

          if (error) {
            console.error("Provisioning failed for social user, rolling back:", error);
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
