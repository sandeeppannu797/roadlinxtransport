import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Read-only archive of the PHP site being migrated, vendored libraries
    // and an old WordPress copy included. Not project source.
    "legacy-src/**",
    // Generated verbatim from legacy-src by scripts/extract-content.mjs.
    "content/**",
  ]),
]);

export default eslintConfig;
