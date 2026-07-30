import type { NextConfig } from "next";
import { PHASE_DEVELOPMENT_SERVER } from "next/constants";

export default (phase: string): NextConfig => {
  const isDev = phase === PHASE_DEVELOPMENT_SERVER;

  return {
    distDir: isDev ? ".next-dev" : ".next",
    turbopack: {},
    webpack: (config, { dev }) => {
      if (dev) {
        // Disable persistent Webpack disk caching in dev mode to prevent Docker volume file lock corruption
        config.cache = false;
      }
      return config;
    },
  };
};
