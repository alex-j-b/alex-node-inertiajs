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

import type { IncomingMessage, ServerResponse } from "node:http";
import type { InlineConfig, ResolvedConfig as ViteResolveConfig } from "vite";

export type HttpContext = {
  request: IncomingMessage;
  response: ServerResponse;
};

export type MaybePromise<T> = T | Promise<T>;

/**
 * Props that will be passed to inertia render method
 */
export type PageProps = Record<string, unknown>;

/**
 * Shared data types
 */
export type Data = string | number | object | boolean;
export type SharedDatumFactory = (ctx: HttpContext) => MaybePromise<Data>;
export type SharedData = Record<string, Data | SharedDatumFactory>;

/**
 * Allowed values for the assets version
 */
export type AssetsVersion = string | number | undefined;

export interface BaseInertiaConfig<T extends SharedData = SharedData> {
  rootElementId?: string;
  assetsVersion?: string;
  encryptHistory?: boolean;
  sharedData?: T;
  indexEntrypoint?: string;
  indexBuildEntrypoint?: string;
  ssrEnabled?: boolean;
  vite?: InlineConfig | ViteResolveConfig;
}

interface InertiaConfigWithoutSSR<T extends SharedData = SharedData>
  extends BaseConfig<T> {
  ssrEnabled?: false;
  ssrEntrypoint?: never;
  ssrBuildEntrypoint?: never;
}

interface InertiaConfigWithSSR<T extends SharedData = SharedData>
  extends BaseConfig<T> {
  ssrEnabled?: true;
  ssrEntrypoint: string;
  ssrBuildEntrypoint: string;
}

export type InertiaConfig<T extends SharedData = SharedData> =
  | InertiaConfigWithSSR<T>
  | InertiaConfigWithoutSSR<T>;

/**
 * Resolved inertia configuration
 */
export interface BaseConfig<T extends SharedData = SharedData> {
  rootElementId: string;
  assetsVersion: string;
  encryptHistory: boolean;
  sharedData?: T;
  indexEntrypoint: string;
  indexBuildEntrypoint: string;
  vite: InlineConfig | ViteResolveConfig;
}

interface ConfigWithoutSSR<T extends SharedData = SharedData>
  extends BaseConfig<T> {
  ssrEnabled: false;
  ssrEntrypoint?: never;
  ssrBuildEntrypoint?: never;
}

interface ConfigWithSSR<T extends SharedData = SharedData>
  extends BaseConfig<T> {
  ssrEnabled: true;
  ssrEntrypoint: string;
  ssrBuildEntrypoint: string;
}

export type ResolvedConfig<T extends SharedData = SharedData> =
  | ConfigWithSSR<T>
  | ConfigWithoutSSR<T>;

export interface PageObject<TPageProps extends PageProps = PageProps> {
  ssrHead?: string[];
  ssrBody?: string;

  /**
   * The name of the JavaScript page component.
   */
  component: string;

  /**
   * The current asset version.
   */
  version: string | number;

  /**
   * The page props (data).
   */
  props: TPageProps;

  /**
   * The page URL.
   */
  url: string;

  /**
   * List of deferred props that will be loaded with subsequent requests
   */
  deferredProps?: Record<string, string[]>;

  /**
   * List of mergeable props that will be merged with subsequent requests
   */
  mergeProps?: string[];

  /**
   * Whether or not to encrypt the current page's history state.
   */
  encryptHistory?: boolean;

  /**
   *  Whether or not to clear any encrypted history state.
   */
  clearHistory?: boolean;
}

/**
 * The shared props inferred from the user config user-land.
 * Should be module augmented by the user
 */
export interface SharedProps {}

/**
 * Signature for the method in the SSR entrypoint file
 */
export type RenderInertiaSsrApp = (
  page: PageObject
) => Promise<{ head: string[]; body: string }>;
