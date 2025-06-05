import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import prettierPlugin from "eslint-plugin-prettier";
import prettierConfig from "eslint-config-prettier";
import globals from "globals";

export default [
	// Base ESLint recommended rules
	eslint.configs.recommended,

	// Add TypeScript support and rules
	...tseslint.configs.recommended,
	...tseslint.configs.recommendedTypeChecked,
	...tseslint.configs.strictTypeChecked,
	...tseslint.configs.stylisticTypeChecked,

	// Apply Prettier config
	prettierConfig,

	// Language options and globals
	{
		files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
		languageOptions: {
			globals: {
				...globals.browser
			},
			parser: tseslint.parser,
			parserOptions: {
				project: "./tsconfig.json",
				tsconfigRootDir: ".",
				ecmaVersion: "latest",
				sourceType: "module"
			}
		}
	},
	// Prettier plugin and rules
	{
		plugins: {
			prettier: prettierPlugin
		},
		rules: {
			"prettier/prettier": "error",
			"@typescript-eslint/explicit-member-accessibility": [
				"error",
				{
					accessibility: "explicit",
					overrides: {
						constructors: "explicit"
					}
				}
			],
			"@typescript-eslint/no-non-null-assertion": "off"
		}
	}
];
