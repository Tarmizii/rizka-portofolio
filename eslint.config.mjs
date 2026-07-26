import { defineConfig, globalIgnores } from "eslint/config";
import nextPlugin from "@next/eslint-plugin-next";
import reactHooks from "eslint-plugin-react-hooks";
import tseslint from "typescript-eslint";

// The lint stack is assembled from the individual plugins instead of
// eslint-config-next: the wrapper drags in eslint-plugin-import /
// eslint-plugin-jsx-a11y / eslint-plugin-react, which all pin the
// vulnerable minimatch@3 → brace-expansion@1 chain (GHSA-mh99-v99m-4gvg).
const eslintConfig = defineConfig([
  ...tseslint.configs.recommended,
  nextPlugin.configs["core-web-vitals"],
  reactHooks.configs.flat.recommended,
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
