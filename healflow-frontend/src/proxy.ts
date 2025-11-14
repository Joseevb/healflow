import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
	const url = request.nextUrl;
	// check if route under /dashboard
	if (url.pathname.startsWith("/dashboard")) {
		const session = await auth.api.getSession({ headers: request.headers });
		if (!session) {
			return NextResponse.redirect(new URL("/auth", request.url));
		}
	}
	return NextResponse.next();
}

export const config = {
	matcher: ["/dashboard/:path*"],
};
