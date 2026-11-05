import app from "../server";

// Route all /api/* requests through the existing Express application.
// Authentication and authorization remain enforced by server/auth.ts.
export default app;
