/** @type {import('next').NextConfig} */
import { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const nextConfig = {
  // Prevent Next.js from inferring the workspace root from an unrelated lockfile
  outputFileTracingRoot: __dirname,

  // Workaround for file-locking / OneDrive issues that can cause
  // `webpack.cache.PackFileCacheStrategy` rename errors in dev mode.
  webpack(config, { dev }) {
    if (dev) {
      config.cache = false;
    }

    // Avoid webpack symlink resolution on Windows/OneDrive, which can cause EINVAL readlink errors.
    // Next.js uses symlink/junctions in `.next/static`, and some Windows setups fail when webpack tries to resolve them.
    if (!config.resolve) config.resolve = {};
    config.resolve.symlinks = false;

    return config;
  },
};

export default nextConfig;
