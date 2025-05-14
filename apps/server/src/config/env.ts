import dotenv from "dotenv";

dotenv.config();

// Here you can define the types for your environment variables.
interface EnvConfig {
  SERVER_URL: string;
  port: string;
  nodeEnv: string;
}

// Define a configuration object that will contain
// server environment variables in a type-safe manner.
const env: EnvConfig = {
  SERVER_URL: process.env.SERVER_URL || "http://localhost:3001",
  port: process.env.PORT || "3001",
  nodeEnv: process.env.NODE_ENV || "development", // production, development
};

export default env;
