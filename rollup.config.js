const ts = require('@rollup/plugin-typescript');
const nodeResolve = require('@rollup/plugin-node-resolve');
const css = require("rollup-plugin-import-css");

module.exports = [
  {
    input: 'src/index.ts',
    external: ['react','react-dom'],
    output: [
      {
        file: 'dist/MinecraftEventDrivenFormReact.js',
        format: 'es',
        sourcemap: true,
      },
    ],
    plugins: [ts(), nodeResolve(), css()],
  },
];
