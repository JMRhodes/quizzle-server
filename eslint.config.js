import antfu from "@antfu/eslint-config";

export default antfu(
  {
    typescript: true,
    formatters: {
      /**
       * Format CSS, LESS, SCSS files, also the `<style>` blocks in Vue
       * By default uses Prettier
       */
      css: true,
      /**
       * Format HTML files
       * By default uses Prettier
       */
      html: true,
      /**
       * Format Markdown files
       * Supports Prettier and dprint
       * By default uses Prettier
       */
      markdown: "prettier",
    },
    stylistic: {
      indent: 2,
      semi: true,
      quotes: "double",
    },
    ignores: ["drizzle", ".husky", "node_modules", "dist", "coverage"],
  },
  {
    rules: {
      "ts/no-redeclare": "off",
      "node/file-extension-in-import": ["error", "always"],
      "ts/consistent-type-definitions": ["error", "type"],
      "no-console": ["warn"],
      "antfu/no-top-level-await": ["off"],
      "node/prefer-global/process": ["off"],
      "node/no-process-env": ["error"],
      "perfectionist/sort-imports": [
        "error",
        {
          tsconfigRootDir: ".",
        },
      ],
      "unicorn/filename-case": [
        "error",
        {
          case: "kebabCase",
          ignore: ["README.md"],
        },
      ],
      "test/prefer-lowercase-title": ["off"],
    },
  },
);
