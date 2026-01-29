import Link from "next/link";

export default function LegalDisclaimer() {
	return (
		<div className="text-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
			By clicking continue, you agree to our{" "}
			<Link href="#">Terms of Service</Link> and{" "}
			<Link href="#">Privacy Policy</Link>.
		</div>
	);
}
