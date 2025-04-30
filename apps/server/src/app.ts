import express, { Express, Request, Response } from "express";

const app: Express = express();

app.use(express.json());

app.get("/api", (_req: Request, res: Response) => {
  console.log("[server]: Hello, World!");
  res.send("Hello, World!");
  return;
});

export default app;
