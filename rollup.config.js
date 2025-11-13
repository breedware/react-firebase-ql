import peerDepsExternal from "rollup-plugin-peer-deps-external";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import { terser } from "rollup-plugin-terser";

export default {
  input: "src/index.ts",
  output: [
    {
      file: "dist/index.esm.js",
      format: "es",
      sourcemap: true
    },
    {
      file: "dist/index.cjs.js",
      format: "cjs",
      sourcemap: true,
      exports: "named"
    }
  ],
  plugins: [
    peerDepsExternal(),
    resolve({ extensions: [".js", ".ts", ".tsx"] }),
    commonjs(),
    typescript({ tsconfig: "./tsconfig.json" }),
    terser()
  ],
  external: ["react", "react-dom", "firebase", /^firebase\//]
};
