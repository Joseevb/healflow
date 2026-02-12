export type IsLoading = {
	loading: boolean;
	type?: "google" | "apple" | "email" | string;
};

export type SocialSignOnProvider = {
	name: string;
	imageUrl: string;
	callbackUrl?: string;
	onClick?: () => void;
};
