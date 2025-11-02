import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/mode-toggle";

export default function AuthLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<>
			<Button asChild variant={"link"}>
				<Link
					href="/"
					className="absolute top-8 left-8 z-20 border-accent-foreground/25 hover:border-accent-foreground/60 bg-card/75 dark:bg-card/5 border backdrop-filter backdrop-blur-md text-foreground transition-all"
				>
					← Home
				</Link>
			</Button>
			<Image
				src="https://plus.unsplash.com/premium_photo-1681843042287-4240248634b5?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
				alt="background"
				fill
				className="object-cover"
				quality={100}
				priority
			/>

			<div className="absolute inset-0 bg-secondary/25 backdrop-filter dark:bg-background/75 backdrop-blur-md">
				<div className="flex flex-col items-center mt-10 gap-15 relative z-10">
					<Image src="/logo-full.png" alt="logo" width={420} height={420} />
					{children}
				</div>
			</div>

			<div className="fixed bottom-10 right-10">
				<ModeToggle />
			</div>
		</>
	);
}
