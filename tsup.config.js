"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tsup_1 = require("tsup");
exports.default = (0, tsup_1.defineConfig)({
    entry: ["src/server.ts"],
    format: ["esm", "cjs"], // Keep this as ESM
    target: "esnext",
    outDir: "dist",
    clean: true,
    bundle: true,
    splitting: false,
    sourcemap: true,
});
//# sourceMappingURL=tsup.config.js.map