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
  return {
    rootElementId: config.rootElementId ?? "app",
    assetsVersion: config.assetsVersion ?? "v1",
    encryptHistory: config.encryptHistory ?? true,
    sharedData: config.sharedData ?? ({} as T),
    indexEntrypoint:
      config.indexEntrypoint ?? path.resolve(process.cwd(), "index.html"),
    indexBuildEntrypoint:
      config.indexBuildEntrypoint ??
      path.resolve(process.cwd(), "build/client/index.html"),
    vite: config.vite ?? {
      server: { middlewareMode: true },
      appType: "custom",
    },
    ...(config.ssrEnabled
      ? {
          ssrEnabled: true,
          ssrEntrypoint: config.ssrEntrypoint!,
          ssrBuildEntrypoint: config.ssrBuildEntrypoint!,
        }
      : { ssrEnabled: false }),
  };
}
