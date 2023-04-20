export interface Config {
  dbConnectionUrl: string;
  dbName: string;
}

export const config: Config = {
  dbConnectionUrl: process.env.MONGODB_CONNECTION_URL,
  dbName: process.env.MONGODB_DB_NAME,
};
