import {
	ApiErrorResponse,
	provisionUser,
	ProvisionUserRequest,
	ValidationErrorResponse,
} from "@/client";
import { ApiKeyConfig } from "@/lib/api-key.config";
import { auth } from "@/lib/auth";
import { Effect } from "effect";
import { TaggedError } from "effect/Data";

export class UserRegistrationError extends TaggedError(
	"UserRegistrationError",
)<{
	message?: string;
}> {}

export class UserRegistrationService {
	#apiKeyConfig: ApiKeyConfig;

	constructor(apiKeyConfig: ApiKeyConfig) {
		this.#apiKeyConfig = apiKeyConfig;
	}

	post(userData: ProvisionUserRequest) {
		const apiKeyConfig = this.#apiKeyConfig;

		return Effect.gen(function* (this: UserRegistrationService) {
			const apiKey = yield* apiKeyConfig.getKey();
			const headerName = yield* apiKeyConfig.getHeaderName();

			const success = yield* Effect.tryPromise({
				try: async () => {
					const res = await provisionUser({
						body: userData,
						headers: {
							[headerName]: apiKey,
						},
					});

					if (res.response.status === 201) {
						return res;
					}

					const errorRes = res.error;

					let errorMessage = "Unknown error";
					switch (errorRes?.status) {
						case 400:
							errorMessage = (errorRes as ValidationErrorResponse).messages
								? `Invalid request: ${JSON.stringify(
										(errorRes as ValidationErrorResponse).messages,
									)}`
								: "Invalid request";
							break;
						case 401:
							errorMessage =
								(errorRes as ApiErrorResponse).message || "Unauthorized";
							break;
						case 403:
							errorMessage =
								(errorRes as ApiErrorResponse).message || "Forbidden";
							break;
					}
					throw new Error(errorMessage);
				},
				catch: (err: unknown) => {
					console.log("Provision error", err);
					const message = err instanceof Error ? err.message : String(err);
					return new UserRegistrationError({ message });
				},
			});

			return success;
		});
	}

	delete(userId: string) {
		auth.api.deleteUser({
			body: {
				token: userId,
			},
		});
	}
}
