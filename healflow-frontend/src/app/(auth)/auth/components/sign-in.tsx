"use client";

import { DynamicFormGroup, FieldConfig } from "@/components/ui/dynamic-form";
import { signInSchema, SignInSchema } from "../schemas/sign-in-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { signIn } from "@/lib/auth-client";
import { toast } from "sonner";
import Link from "next/link";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { IsLoading } from "@/app/(auth)/auth/types";
import LegalDisclaimer from "./legal-disclaimer";
import SocialSignOn from "./social-sign-on";
import { Spinner } from "@/components/ui/spinner";

const fieldConfigs: Record<keyof SignInSchema, FieldConfig> = {
	email: {
		label: "Email",
		type: "email",
	},
	password: {
		label: "Password",
		type: "password",
	},
	rememberMe: {
		label: "Remember me",
		type: "checkbox",
		className: "flex flex-row",
	},
} as const;

export default function SignIng() {
	const [isLoading, setIsLoading] = useState<IsLoading>({
		loading: false,
		type: "email",
	});
	const [error, setError] = useState<string | null>(null);

	const form = useForm<SignInSchema>({
		defaultValues: {
			email: "",
			password: "",
			rememberMe: false,
		},
		resolver: zodResolver(signInSchema),
	});

	async function handleSubmit(data: SignInSchema) {
		await signIn.email({
			...data,
			callbackURL: "/dashboard",
			fetchOptions: {
				onError: (error) => setError(error.error.message),
				onRequest: () => setIsLoading({ loading: true, type: "email" }),
				onResponse: () => setIsLoading({ loading: false, type: "email" }),
				onSuccess: async () => (
					toast.success("Successfully signed in!"),
					undefined
				),
			},
		});
	}

	return (
		<div className="flex flex-col gap-6">
			<Card className="backdrop-blur-md bg-card/75 dark:bg-card/5">
				<CardHeader>
					<CardTitle>Sign in</CardTitle>
					<CardDescription>Sign in with your Google account</CardDescription>
				</CardHeader>
				<CardContent>
					<SocialSignOn isLoading={isLoading} setIsLoading={setIsLoading} />
					<span className="block text-center text-sm mx-auto mt-10">
						Or continue with
					</span>
					<Separator className="mb-6" />
					<Form {...form}>
						{error && (
							<Alert variant={"destructive"} className="mb-5">
								<AlertTitle>Error signing up</AlertTitle>
								<AlertDescription>{error}</AlertDescription>
							</Alert>
						)}
						<form onSubmit={form.handleSubmit(handleSubmit)}>
							<div className="flex flex-col gap-4 mb-4">
								<DynamicFormGroup<SignInSchema>
									fieldConfigs={fieldConfigs}
									control={form.control}
								/>
							</div>
							<Button
								type="submit"
								disabled={isLoading.loading && isLoading.type === "email"}
								className="cursor-pointer w-full"
							>
								{isLoading.loading && isLoading.type === "email" && <Spinner />}
								Sign in
							</Button>
						</form>
					</Form>
				</CardContent>
				<CardFooter className="gap-2 text-sm text-center">
					<span>Don&lsquo;t have an account?</span>
					<Link href="/auth/sign-up" className="underline underline-offset-4">
						Sign up
					</Link>
				</CardFooter>
			</Card>

			<LegalDisclaimer />
		</div>
	);
}
