// Your main application entry point
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const port = 3000;

const handler = (request: Request): Response => {
  return new Response("Hello from Deno!");
};

// Wrap the server start in an async function to avoid top-level await
async function startServer() {
  console.log(`Server running at http://localhost:${port}`);
  await serve(handler, { port });
}

startServer().catch(console.error); 