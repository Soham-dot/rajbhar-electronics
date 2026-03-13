/** @type {import('next').NextConfig} */
import { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const nextConfig = {
  // Prevent Next.js from inferring the workspace root from an unrelated lockfile
  outputFileTracingRoot: __dirname,

  webpack(config) {
    // Avoid webpack symlink resolution on Windows/OneDrive
    if (!config.resolve) config.resolve = {};
    config.resolve.symlinks = false;

    return config;
  },
};

export default nextConfig;
