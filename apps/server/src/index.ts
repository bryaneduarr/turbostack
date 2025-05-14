import express, { Express, Request, Response } from "express";

import env from "./config/env";

const app: Express = express();

app.use(express.json());

app.get("/api", (_req: Request, res: Response) => {
  console.log("[server]: Hello, World!");
  res.send("Hello, World!");
  return;
});

app.listen(env.port, () => {
  console.log(`[server]: Server is running on port ${env.SERVER_URL}`);
});

export default app;
