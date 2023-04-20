declare namespace NodeJS {
  interface ProcessEnv {
    SERVER_NAMESPACE: string;
    SERVER_PORT: string;
    MONGODB_CONNECTION_URL: string;
    MONGODB_DB_NAME: string;
  }
}