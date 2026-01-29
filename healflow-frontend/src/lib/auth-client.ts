import { adminClient, inferAdditionalFields, jwtClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import type { auth } from "./auth";

export const authClient = createAuthClient({
  baseURL: process.env.PUBLIC_APP_URL || "http://localhost:3000",
  plugins: [jwtClient(), adminClient(), inferAdditionalFields<typeof auth>()],
  callbackURL: "/dashboard",
});

export const { signIn, signOut, signUp, useSession, getSession } = authClient;
