import { createFileRoute, redirect } from "@tanstack/react-router";
import { checkIsNewUser } from "@/server/auth";

export const Route = createFileRoute("/auth/social-callback")({
  beforeLoad: async () => {
    const { isNewUser } = await checkIsNewUser();

    if (isNewUser) {
      throw redirect({ to: "/auth/sign-up/user-data" });
    } else {
      throw redirect({ to: "/dashboard" });
    }
  },
});
