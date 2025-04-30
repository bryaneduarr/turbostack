import dotenv from "dotenv";

dotenv.config();

// Here you can define the types for your environment variables.
interface Config {
  port: number;
  nodeEnv: string;
}

// Define a configuration object that will contain
// server environment variables in a type-safe manner.
const config: Config = {
  port: Number(process.env.PORT) || 3001,
  nodeEnv: process.env.NODE_ENV || "development", // production, development
};

export default config;
