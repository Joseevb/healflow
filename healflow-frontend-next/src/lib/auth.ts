import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db";
import { admin, jwt, openAPI } from "better-auth/plugins";
import { APIError } from "better-auth/api";
import * as schema from "@/db/schemas/auth-schema";
import { apiKeyConfig } from "./api-key.config";
import { UserRegistrationService } from "@/services/user-registration.service";
import { Effect } from "effect";

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: "pg",
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
				before: async (user) => {
					const service = new UserRegistrationService(apiKeyConfig);

					const provisionEffect = Effect.gen(function* () {
						const userId = crypto.randomUUID();
						user.id = userId;
						yield* service.post({ user_id: userId, email: user.email });
					}).pipe(
						Effect.catchAll((err) => {
							console.error("Provisioning failed, aborting user creation:", err);
							return Effect.fail(
								new APIError("INTERNAL_SERVER_ERROR", {
									message: "Failed to provision user. Please try again.",
								})
							);
						})
					);

					await Effect.runPromise(provisionEffect);

					return { data: user };
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
