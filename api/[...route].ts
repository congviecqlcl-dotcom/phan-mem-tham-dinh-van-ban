import app from "../server.ts";

// Route all /api/* requests through the existing Express application.
// Use an explicit TypeScript extension so Vercel's Node.js ESM runtime
// does not attempt to resolve "../server" as a directory.
// Authentication and authorization remain enforced by server/auth.ts.
export default app;
