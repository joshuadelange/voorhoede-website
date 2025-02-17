import { nodeResolve } from "@rollup/plugin-node-resolve";

export default {
  input: "src/service-worker/service-worker.ts",
  output: {
    dir: "src/public",
    format: "cjs",
  },
  plugins: [nodeResolve()],
};
