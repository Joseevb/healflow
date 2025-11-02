import { defineConfig } from "orval";

export default defineConfig({
	hospital_api: {
		input: {
			target: process.env.API_DOCS_URL || "http://localhost:8080/v3/api-docs",
			validation: false,
			override: {
				transformer: (openApi) => {
					// remove all paths matching /docs/** and /actuator/**
					for (const p of Object.keys(openApi.paths || {})) {
						if (p.startsWith("/docs") || p.startsWith("/actuator")) {
							delete openApi.paths![p];
						}
					}
					return openApi;
				},
			},
		},
		output: {
			mode: "tags-split",
			client: "react-query",
			httpClient: "fetch",
			target: "src/api/clients",
			schemas: "src/api/schemas",
			prettier: true,
			headers: false,
			namingConvention: "kebab-case",
			baseUrl: process.env.API_BASE_URL || "http://localhost:8080",
			override: {
				mutator: {
					path: "./src/api/custom-fetch.ts",
					name: "customFetch",
				},
			},
		},
	},
	hospital_api_zod: {
		input: {
			target: process.env.API_DOCS_URL || "http://localhost:8080/v3/api-docs",
			validation: false,
		},
		output: {
			mode: "tags-split",
			client: "zod",
			httpClient: "fetch",
			target: "src/api/clients",
			schemas: "src/api/schemas",
			prettier: true,
			headers: false,
			namingConvention: "kebab-case",
			fileExtension: ".zod.ts",
			baseUrl: process.env.API_BASE_URL || "http://localhost:8080",
			override: {
				mutator: {
					path: "./src/api/custom-fetch.ts",
					name: "customFetch",
				},
			},
		},
	},
});
