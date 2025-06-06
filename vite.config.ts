import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import { createHtmlPlugin } from "vite-plugin-html";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig(({ mode }) => {
	// Load environment variables based on the mode (development or production)
	const env = loadEnv(mode, process.cwd());

	return {
		build: {
			target: "es2020",
			minify: true,
			rollupOptions: {
				onwarn(warning, warn) {
					// Suppress "Module level directives cause errors when bundled" warnings
					if (warning.code === "MODULE_LEVEL_DIRECTIVE") {
						return;
					}
					warn(warning);
				},
			},
			sourcemap: false, // Disable source maps in production
		},
		optimizeDeps: {
			esbuildOptions: {
				target: "es2020",
			},
		},
		plugins: [
			react(),
			tailwindcss(),
			tsconfigPaths(),
			createHtmlPlugin({
				inject: {
					data: {
						// VITE_API_URL: env.VITE_API_URL,
					},
				},
			}),
		],
		server: {
			host: true,
		},
		resolve: {
			alias: {
				// "@telegram-apps/sdk": path.resolve(
				// 	"node_modules/@telegram-apps/sdk/src",
				// ),
				"@images": path.resolve(__dirname, "src/assets/game-plinko/img"),
				"@sounds": path.resolve(__dirname, "src/assets/game-plinko/sounds"),
			},
		},
	};
});
