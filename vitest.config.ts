import { configDefaults, defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";
import { getViteConfig } from "astro/config";

export default getViteConfig({
  test: {
    exclude: [...configDefaults.exclude, "e2e/*"],
  },
  plugins: [tsconfigPaths()],
});
