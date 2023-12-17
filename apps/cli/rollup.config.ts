import {defineConfig} from "rollup";
import typescript from "@rollup/plugin-typescript";
import json from "@rollup/plugin-json";

const externalDeps = [
    "@prisma/client",
    "node:readline/promises",
    "node:stream",
    "fs",
    "node:path",
    "node:url",
    "argon2"
];

export default defineConfig([
    {
        input: "src/index.ts",
        output: {
            file: "dist/index.js",
            sourcemap: true,
            format: "es"
        },
        external: externalDeps,
        plugins: [typescript(), json()]
    }
])
