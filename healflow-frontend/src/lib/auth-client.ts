import {
	adminClient,
	inferAdditionalFields,
	jwtClient,
} from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import { auth } from "./auth";

export const authClient = createAuthClient({
	baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
	plugins: [jwtClient(), adminClient(), inferAdditionalFields<typeof auth>()],
	callbackURL: "/dashboard",
});

export const { signIn, signOut, signUp, useSession, getSession } = authClient;
