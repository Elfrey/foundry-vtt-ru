import { resolve } from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
	build: {
		outDir: resolve(__dirname, "ru-ru"),
		lib: {
			entry: resolve(__dirname, "src/index.js"),
			formats: ["es"],
			name: "ru-ru",
		},
		rollupOptions: {
			output: {
				entryFileNames: "esm/[name].js",
				chunkFileNames: "esm/[name].js",
			},
		},
	},
});
