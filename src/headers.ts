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

/**
 * List of possible headers used by InertiaJS
 */
export const InertiaHeaders = {
  Inertia: "x-inertia",
  Reset: "x-inertia-reset",
  Version: "x-inertia-version",
  Location: "x-inertia-location",
  ErrorBag: "X-Inertia-Error-Bag",
  PartialOnly: "x-inertia-partial-data",
  PartialExcept: "x-inertia-partial-except",
  PartialComponent: "x-inertia-partial-component",
} as const;
