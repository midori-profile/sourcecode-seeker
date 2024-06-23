import typescript from "@rollup/plugin-typescript";
// Import Terser plugin for Rollup, used to minify JavaScript code
import terser from "@rollup/plugin-terser";
import copy from "rollup-plugin-copy";

const plugins = [
  typescript({ compilerOptions: { target: "es2017" } }),
  terser(),
];

/** @type {import('rollup').RollupOptions} */
export default [
  {
    input: "src/content.ts",
    output: {
      file: "dist/content.js",
      format: "iife",
      sourcemap: false,
    },
    watch: {
      include: ["src/content.ts"],
    },
    plugins: [
      ...plugins,
      copy({
        targets: [
          { src: 'src/manifest.json', dest: 'dist' },
          { src: 'src/images/*', dest: 'dist/images' },
        ],
        verbose: true,
      })
    ],
  },
  {
    input: "src/serviceWorker.ts",
    output: {
      file: "dist/serviceWorker.js",
      format: "iife",
      sourcemap: false,
    },
    watch: {
      include: "src/serviceWorker.ts",
    },
    plugins,
  },
  {
    input: `src/utils/index.ts`,
    output: [
      {
        file: `dist/utils.js`,
        format: "iife",
        sourcemap: false,
      },
    ],
    plugins,
  },
];