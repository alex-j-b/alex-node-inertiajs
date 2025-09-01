import { Inertia } from "./inertia.js";
import type { InertiaConfig } from "./types.js";
import type { NextFunction, Request, Response } from "express";
import type { ViteDevServer } from "vite";

export function inertiaMiddleware(config: InertiaConfig, vite?: ViteDevServer) {
  return async (req: Request, res: Response, next: NextFunction) => {
    res.inertia = new Inertia(req, res, config, vite);
    next();
  };
}
