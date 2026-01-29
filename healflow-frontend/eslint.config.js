//  @ts-check

import { tanstackConfig } from "@tanstack/eslint-config";
import drizzlePlugin from "eslint-plugin-drizzle";

export default [
  ...tanstackConfig,
  {
    plugins: {
      drizzle: drizzlePlugin,
    },
    rules: {
      "drizzle/enforce-delete-with-where": "error",
      "drizzle/enforce-update-with-where": "error",
    },
  },
  {
    ignores: [
      // 'src/components/ui/**',
      // 'src/components/animate-ui/**',
      "prettier.config.js",
      "eslint.config.js",
      "src/client/**",
    ],
  },
];
