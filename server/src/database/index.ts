import { mongoDbConfig } from '@todo-app/server/configs';
import { MongoConnection } from './dbConnection';

export type { IMongoConnection } from './dbConnection';
export const mongoConnection = new MongoConnection(mongoDbConfig.dbConnectionUrl);