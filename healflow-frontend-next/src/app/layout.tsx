import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import "@/app/globals.css";
import { QueryClientProvider } from "@/components/providers/query-provider";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { client } from "@/client/client.gen";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Healflow | Modern Hospital Management System",
	description:
		"Streamline your healthcare experience with our comprehensive platform. Book appointments, manage medical records, and connect with healthcare providers all in one secure place.",
};

const getToken = async () =>
	auth.api.getToken({ headers: await headers() }).then((t) => t.token);

client.interceptors.request.use(async (request) => {
	console.log("Intercepting request:", request);
	const token = await getToken();
	console.log("Token:", token);
	request.headers.set("Authorization", `Bearer ${token}`);
	return request;
});

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<head />
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				<QueryClientProvider>
					<ThemeProvider
						attribute="class"
						defaultTheme="system"
						enableSystem
						disableTransitionOnChange
					>
						<main>{children}</main>
						<Toaster richColors={true} />
					</ThemeProvider>
				</QueryClientProvider>
			</body>
		</html>
	);
}
