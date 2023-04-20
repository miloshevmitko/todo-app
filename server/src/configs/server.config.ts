export interface Config {
  namespace: string;
  port: string;
}

export const config: Config = {
  namespace: process.env.SERVER_NAMESPACE,
  port: process.env.SERVER_PORT,
};
