import globals from "globals";
import pluginJs from "@eslint/js";

/** @type {import('eslint').Linter.Config[]} */
export default [
  // Configuração para arquivos JavaScript no padrão CommonJS
  {
    files: ["**/*.js"],
    languageOptions: {
      sourceType: "commonjs",
      ecmaVersion: "latest", // Suporte para recursos modernos do ECMAScript
    },
    linterOptions: {
      reportUnusedDisableDirectives: true, // Identifica diretivas do ESLint que não estão sendo usadas
    },
  },
  // Define os globais do Node.js para todos os arquivos
  {
    languageOptions: {
      globals: globals.node,
    },
  },
  // Configuração recomendada do ESLint para JavaScript
  pluginJs.configs.recommended,
];
