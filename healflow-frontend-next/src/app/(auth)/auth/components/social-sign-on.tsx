import { Dispatch, SetStateAction } from "react";
import { IsLoading, SocialSignOnProvider } from "../types";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { signIn } from "@/lib/auth-client";
import { toast } from "sonner";

export const socialSignOnProviders: SocialSignOnProvider[] = [
	{
		name: "google",
		imageUrl: "/google.svg",
	},
	{
		name: "apple",
		imageUrl: "/apple.svg",
		onClick: () => toast.error("Apple sign in is not implemented yet"),
	},
];

interface SocialSignOnProps {
	isLoading: IsLoading;
	signUp?: boolean;
	setIsLoading: Dispatch<SetStateAction<IsLoading>>;
}

export default function SocialSignOn({
	isLoading,
	signUp = false,
	setIsLoading,
}: SocialSignOnProps) {
	return (
		<div className="space-y-2">
			{socialSignOnProviders.map((provider) => (
				<Button
					key={provider.name}
					variant="outline"
					className="w-full gap-2"
					disabled={isLoading.type === provider.name && isLoading.loading}
					onClick={async () => {
						await signIn.social(
							{
								provider: provider.name,
								callbackURL: provider.callbackUrl ?? "/",
							},
							{
								onRequest: () => {
									setIsLoading({ loading: true, type: provider.name });
									provider.onClick?.();
								},
								onResponse: () => {
									setIsLoading({ loading: false, type: provider.name });
								},
							},
						);
					}}
				>
					<Image
						src={provider.imageUrl}
						alt={`${provider.name} logo`}
						width={16}
						height={16}
					/>
					<div>
						<span>Sign {signUp ? "up" : "in"} with </span>{" "}
						<span className="capitalize">{provider.name}</span>
					</div>
				</Button>
			))}
		</div>
	);
}
