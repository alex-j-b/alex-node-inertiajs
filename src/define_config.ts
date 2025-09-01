/*
 * This file is originally developed as part of @adonisjs/inertia
 * (c) AdonisJS
 *
 * This file has been modified by Mahendra Chavda
 * to work with express-inertia
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import path from "node:path";
import type { InertiaConfig, ResolvedConfig, SharedData } from "./types.js";

/**
 * Define the Inertia configuration
 */
export function defineConfig<T extends SharedData>(
  config: InertiaConfig<T>
): ResolvedConfig<T> {
  const {
    rootElementId,
    assetsVersion,
    encryptHistory,
    indexEntrypoint,
    indexBuildEntrypoint,
    vite,
    ...reset
  } = config;
  return {
    rootElementId: rootElementId || "app",
    assetsVersion: assetsVersion || "v1",
    encryptHistory: encryptHistory || true,
    indexEntrypoint:
      indexEntrypoint || path.resolve(process.cwd(), "index.html"),
    indexBuildEntrypoint:
      indexBuildEntrypoint ||
      path.resolve(process.cwd(), "build/client/index.html"),
    vite: {
      server: { middlewareMode: true },
      appType: "custom",
      ...vite,
    },
    ...reset,
  };
}
