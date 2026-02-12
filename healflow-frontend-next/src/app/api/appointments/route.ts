import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
	const authHeader = request.headers.get("Authorization");

	const jwt =
		authHeader?.startsWith("Bearer ") && authHeader.length > 7
			? authHeader.substring(7).trim()
			: null;

	console.log("Value of jwt after initial check:", jwt);

	const headers: HeadersInit = {
		"Content-Type": "application/json",
	};

	if (typeof jwt === "string" && jwt.length > 0) {
		console.log("Adding Authorization header with jwt:", jwt);
		headers.Authorization = `Bearer ${jwt}`;
	} else {
		console.log("No valid JWT found, skipping Authorization header.");
	}

	console.log("Final headers object:", headers);

	try {
		const response = await fetch(
			process.env.API_URL ?? "http://localhost:8080/api/v1/appointments",
			{
				method: "GET",
				headers,
			},
		);

		return new Response(JSON.stringify(await response.json(), null, 2), {
			status: response.status,
		});
	} catch (error) {
		console.log(error);
		return new Response(JSON.stringify(error), { status: 500 });
	}
}
