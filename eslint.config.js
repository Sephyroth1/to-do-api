import globals from "globals";
import pluginJs from "@eslint/js";

export default [
	{
		languageOptions: {
			globals: globals.node, // Enables Node.js globals like 'process'
		},
	},
	pluginJs.configs.recommended,
];
