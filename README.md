# node-inertiajs

[![npm version](https://img.shields.io/npm/v/node-inertiajs)](https://www.npmjs.com/package/node-inertiajs)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A lightweight Node.js adapter for [Inertia.js](https://inertiajs.com/) that lets you build modern single-page applications with server-side rendering. It allows seamless integration of React, Vue, or Svelte components while preserving the simplicity of classic apps.

If you’re already using a backend framework, check out these official adapters instead:

- [express-inertia](https://npmjs.com/package/express-inertia)
- [fastify-inertia](https://npmjs.com/package/fastify-inertia)
- [hapi-inertia](https://npmjs.com/package/hapi-inertia)

### Prerequisites

- Node.js 18 or higher
- Express.js
- Vite

### Step 1: Create a Vite Project

First, create a new project using Vite with your preferred framework:

```bash
# For React (used in this guide)
npm create vite@latest my-inertia-app -- --template react

# For Vue
npm create vite@latest my-inertia-app -- --template vue

# For Svelte
npm create vite@latest my-inertia-app -- --template svelte

cd my-inertia-app
```

### Step 2: Install Required Packages

Install the necessary dependencies for Express and Inertia:

```bash
# For React (used in this guide)
npm install @inertiajs/react

# For Vue
npm install @inertiajs/vue3

# For Svelte
npm install @inertiajs/svelte

# Additional dev dependencies
npm install -D nodemon
```

### Step 3: Project Structure

Set up your project structure as follows:

```
my-inertia-app/
├── build/                 # Generated build artifacts
├── public/                # Static assets
├── src/
│   ├── pages/            # Inertia page components
│   ├── assets/           # Styles, images, etc.
│   ├── main.jsx          # Client entry point (or .js/.vue/.svelte)
│   └── ssr.jsx           # SSR entry point (optional)
├── index.html            # HTML template
├── vite.config.js        # Vite configuration
├── server.js             # Express server
└── package.json
```

### Step 4: Express Server Setup (`server.js`)

```javascript
import http from "http";
import { Inertia } from "node-inertiajs";
import { createServer as createViteServer } from "vite";

const PORT = process.env.PORT || 3000;

// Inertia configuration
const config = {
  rootElementId: "app",
  ssrEnabled: true,
  ssrEntrypoint: "src/ssr.jsx",
  ssrBuildEntrypoint: "build/ssr/ssr.js",
};

async function bootstrap() {
  // Create Vite server once, not on every request
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: "custom",
  });

  const server = http.createServer(async (req, res) => {
    // Run Vite middleware first (for HMR / module transforms)
    vite.middlewares(req, res, (err) => {
      if (err) throw err;
    });

    // Create Inertia instance per request
    const inertia = new Inertia(req, res, config, vite);

    // Simple routing
    if (req.url === "/") {
      return inertia.render("home");
    } else if (req.url === "/about") {
      return inertia.render("about");
    } else {
      return inertia.render("not_found");
    }
  });

  server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

bootstrap();
```

### Step 5: Update Package.json Scripts

```json
{
  "scripts": {
    "dev": "nodemon server.js",
    "start": "cross-env NODE_ENV=production node server.js",
    "build": "npm run build:ssr && npm run build:client",
    "build:client": "vite build --outDir build/client",
    "build:ssr": "vite build --outDir build/ssr --ssr src/ssr.jsx"
  }
}
```

### Step 6: Client Entry Point (src/main.jsx)

Update your framework's main entry point accordingly. For more details, visit [Inertia.js Client-Side Setup](https://inertiajs.com/client-side-setup#initialize-the-inertia-app):

```javascript
import { createInertiaApp } from "@inertiajs/react";
import { createRoot } from "react-dom/client";

createInertiaApp({
  id: "root",
  resolve: (name) => {
    const pages = import.meta.glob("./pages/**/*.jsx", { eager: true });

    return pages[`./pages/${name}.jsx`];
  },
  setup({ el, App, props }) {
    createRoot(el).render(<App {...props} />);
  },
});
```

### Step 7: SSR Entry Point (src/ssr.jsx) - Optional

Add Server-Side Rendering support for improved SEO and performance.

```javascript
import ReactDOMServer from "react-dom/server";
import { createInertiaApp } from "@inertiajs/react";

export default function render(page) {
  return createInertiaApp({
    id: "root",
    page,
    render: ReactDOMServer.renderToString,
    resolve: (name) => {
      const pages = import.meta.glob("./pages/**/*.jsx", { eager: true });

      return pages[`./pages/${name}.jsx`];
    },
    setup: ({ App, props }) => <App {...props} />,
  });
}
```

## Configuration

### Middleware Options

| Option                 | Type       | Default                        | Description                                                   |
| ---------------------- | ---------- | ------------------------------ | ------------------------------------------------------------- |
| `rootElementId`        | `string?`  | `"app"`                        | DOM element ID where the Inertia app mounts                   |
| `assetsVersion`        | `string?`  | `"v1"`                         | Version string used for inertia                               |
| `encryptHistory`       | `boolean?` | `true`                         | Encrypts the Inertia history state for security               |
| `indexEntrypoint`      | `string?`  | `"index.html"`                 | Path to your base HTML template (used in dev mode)            |
| `indexBuildEntrypoint` | `string?`  | `"build/client/index.html"`    | Path to the built client HTML entrypoint (used in production) |
| `ssrEnabled`           | `boolean?` | `false`                        | Enables/disables server-side rendering (SSR)                  |
| `ssrEntrypoint`        | `string?`  | Required if `ssrEnabled: true` | Path to your SSR entry file (used in development)             |
| `ssrBuildEntrypoint`   | `string?`  | Required if `ssrEnabled: true` | Path to the built SSR bundle (used in production)             |

Perfect! Let’s write the **API Reference** for `node-inertiajs`, showing how the core `Inertia` class works in Node.js.

## API Reference

### `new Inertia(req, res, config?, vite?)`

Creates a new Inertia instance for the current request.

### `inertia.render(component: string, props?: object)`

Renders an Inertia page component to the client or via SSR.

- `component` – The page component name (e.g., `"home"`).
- `props` – Optional object of props to pass to the page.

**Example:**

```js
inertia.render("about", { info: "About page data" });
```

### `inertia.share(data: object)`

Shares data with the current and subsequent requests. Useful for auth info, flash messages, or global props.

```js
inertia.share({
  auth: { user: req.user },
  flash: { success: req.flash("success") },
});
```

### `inertia.redirect(urlOrStatus: string | number, url?: string)`

Redirects the user while preserving Inertia’s client-side navigation behavior.

```js
// Default 302 redirect
inertia.redirect("/dashboard");

// Explicit status
inertia.redirect(301, "/new-home");
```

## Contributing

We welcome contributions! Please feel free to submit issues, feature requests, or pull requests.

### Guidelines

1. **Fork** the repository
2. **Create** your feature branch:

   ```bash
   git checkout -b feat/amazing-feature
   ```

3. **Commit** your changes with a descriptive message:

   ```bash
   git commit -m "feat: add amazing feature"
   ```

4. **Push** to your branch:

   ```bash
   git push origin feat/amazing-feature
   ```

5. **Open a Pull Request**

### Breaking Changes

If your contribution introduces a **breaking change** (e.g. changes to configuration options, API methods, or default behavior), please **open an issue or discussion first** before submitting a PR. This ensures we can:

- Discuss the impact on existing users
- Decide if a major version bump is required
- Provide a clear migration path in the documentation

## License

This project is licensed under the MIT License - see the [LICENSE](https://opensource.org/licenses/MIT) file for details.

## Resources

- [Inertia.js Documentation](https://inertiajs.com/)
- [React.js Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
