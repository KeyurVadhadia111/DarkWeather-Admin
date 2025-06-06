import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import unusedImports from "eslint-plugin-unused-imports";
import { fixupPluginRules } from "@eslint/compat";

/** @type {import('eslint').Linter.Config[]} */
export default [
	{ files: ["**/*.{ts, tsx}"] },
	pluginJs.configs.recommended,
	...tseslint.configs.recommended,
	{
		plugins: {
			"unused-imports": fixupPluginRules(unusedImports),
		},
		rules: {
			"@typescript-eslint/no-unused-vars": "off",
			"@typescript-eslint/no-explicit-any": "warn",
			"no-undef": "off",
			"prefer-const": "warn",
			"no-constant-binary-expression": "warn",
			"unused-imports/no-unused-imports": "warn",
			"@typescript-eslint/no-unused-expressions": "warn",
			"no-unsafe-optional-chaining": "warn",
			"@typescript-eslint/no-require-imports": "warn",
			"no-async-promise-executor": "warn",
			"no-constant-condition": "warn",
			"prefer-rest-params": "warn",
			"unused-imports/no-unused-vars": [
				"warn",
				{
					vars: "all",
					varsIgnorePattern: "^_",
					args: "after-used",
					argsIgnorePattern: "^_",
				},
			],
		},
	},
	{
		languageOptions: {
			globals: { ...globals.browser, ...globals.node },
		},
	},
];
