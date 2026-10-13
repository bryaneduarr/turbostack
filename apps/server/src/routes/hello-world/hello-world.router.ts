import { createRouter } from "@/config/http/routing/http-router.config";
import { helloWorldContract } from "@/routes/hello-world/hello-world.contract";
import { helloWorldHandler } from "@/routes/hello-world/hello-world.handler";

const helloWorldRouter = createRouter().get(
  "/hello-world",
  helloWorldHandler,
  helloWorldContract,
);

export default helloWorldRouter;
