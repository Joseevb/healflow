import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { admin, jwt, openAPI } from "better-auth/plugins";
import { APIError } from "better-auth/api";
import { Effect } from "effect";
import { apiKeyConfig } from "./api-key.config";

import { db } from "@/db";
import * as schema from "@/db/schemas/auth-schema";
import { UserRegistrationService } from "@/services/user-registration.service";
import { useSignUpSession } from "@/server/session";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "sqlite",
    schema: { ...schema },
  }),

  advanced: {
    database: {
      generateId: () => crypto.randomUUID(),
    },
  },

  databaseHooks: {
    user: {
      create: {
        before: async (user, ctx) => {
          const isSocialSignOn = ctx?.params?.id === "google";
          user.id = user.id || crypto.randomUUID();

          if (isSocialSignOn) {
            return {
              data: user,
            };
          }

          const service = new UserRegistrationService(apiKeyConfig);

          const provisionEffect = Effect.gen(function* () {
            user.id = user.id || crypto.randomUUID();
            yield* service.post({
              user_id: user.id,
              email: user.email,
              specialist_id: "TODO",
            });
          }).pipe(
            Effect.catchAll((err) => {
              console.error("Provisioning failed, aborting user creation:", err);
              return Effect.fail(
                new APIError("INTERNAL_SERVER_ERROR", {
                  message: "Failed to provision user. Please try again.",
                }),
              );
            }),
          );

          await Effect.runPromise(provisionEffect);

          return { data: user };
        },
        after: async (user, ctx) => {
          const isSocialSignOn = ctx?.params?.id === "google";

          if (isSocialSignOn) {
            const session = await useSignUpSession();

            await session.update({
              state: "social-sign-on" as const,
              createdUserId: user.id,
              accountData: {
                email: user.email,
                firstName: user.name.split(" ")[0] || "",
                lastName: user.name.split(" ").slice(1).join(" ") || "",
              },
            });
          }
        },
      },
    },
  },

  callbackURL: "/dashboard",
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  emailAndPassword: { enabled: true, requireEmailVerification: false },
  plugins: [
    jwt({
      jwks: { keyPairConfig: { alg: "RS256" } },
    }),
    openAPI(),
    admin(),
  ],
  user: { modelName: "users" },
  session: { modelName: "sessions" },
  account: {
    modelName: "accounts",
    accountLinking: {
      enabled: true,
    },
  },
  verification: { modelName: "verifications" },
});
