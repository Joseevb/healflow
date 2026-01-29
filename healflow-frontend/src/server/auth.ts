import { createServerFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { Effect } from "effect";

import { useSignUpSession } from "./session";
import { getSession } from "@/lib/auth-client";
import { apiKeyConfig } from "@/lib/api-key.config";
import { UserSyncService } from "@/services/user-sync.service";

export const checkIsNewUser = createServerFn({ method: "GET" }).handler(async () => {
  const session = await useSignUpSession();
  const sessionData = session.data;

  // Check if there's a sign-up session with social-sign-on state
  const isNewUser = sessionData.state === "social-sign-on" && !!sessionData.createdUserId;

  return { isNewUser };
});

/**
 * Gets the current user session on the server side.
 * This properly forwards request headers to access cookies.
 */
export const getServerSession = createServerFn({ method: "GET" }).handler(async () => {
  const headers = getRequestHeaders();

  const session = await getSession({
    fetchOptions: {
      headers,
    },
  });

  return session.data;
});

/**
 * Syncs users between Better Auth and the backend API.
 * Validates all user IDs and removes stale users that don't exist in the backend.
 */
export const syncUsers = createServerFn({ method: "GET" }).handler(async () => {
  const syncService = new UserSyncService(apiKeyConfig);

  const result = await Effect.runPromise(
    syncService.sync().pipe(
      Effect.catchAll((err) => {
        console.error("[UserSync] Sync failed:", err.message);
        return Effect.succeed({ validated: 0, deleted: 0, error: err.message });
      }),
    ),
  );

  return result;
});
