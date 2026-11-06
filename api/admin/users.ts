import app from "../../dist/server.cjs";

// Explicit route for the read-only admin account listing.
// Keep authentication and QUAN_TRI authorization in the shared Express app.
export default app;
