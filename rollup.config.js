import terser from "@rollup/plugin-terser";

export default {
  input: "js/xor128.js",
  output: {
    file: "dist/xor128.js",
    format: "es",
  },
  plugins: [terser()],
};
