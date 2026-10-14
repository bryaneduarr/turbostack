import type { ValidatedServerEnvironment } from "@workspace/schemas/server/environment/server-env.interface";
import { serverEnvSchema } from "@workspace/schemas/server/environment/server-env.schema";

const env: ValidatedServerEnvironment = serverEnvSchema.parse(process.env);

export default env;
