import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // TypeScript правила
      "@typescript-eslint/no-unused-vars": ["error", { 
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_" 
      }],
      "@typescript-eslint/explicit-function-return-type": "warn",
      "@typescript-eslint/no-explicit-any": "warn",
      
      // React правила
      "react-hooks/exhaustive-deps": "warn",
      "react/jsx-key": "error",
      "react/no-array-index-key": "warn",
      
      // Общие правила
      "prefer-const": "error",
      "no-var": "error",
      "no-console": "warn",
      
      // Правила для React Query
      "@tanstack/query/no-unstable-deps": "warn",
    },
  },
];

export default eslintConfig;
