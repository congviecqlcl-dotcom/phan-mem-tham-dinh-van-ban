import app from "../dist/server.cjs";

// Vercel bundles this function separately from the Vite source tree.
// Load the compiled Express application produced by the build script;
// keep the existing authentication and authorization middleware intact.
export default app;
