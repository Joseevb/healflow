import SignIn from "./components/sign-in";
import { ViewTransition } from "react";

export default function Auth() {
	return (
		<ViewTransition>
			<SignIn />
		</ViewTransition>
	);
}
