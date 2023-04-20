import type { Db, DbOptions, Document, MongoClientOptions } from 'mongodb';
import { MongoClient, ServerApiVersion } from 'mongodb';

interface PingDocument extends Document {
  ok: number;
}

export interface IMongoConnection {
  /**
   * Client capable to make connection to a MongoDb.
   */
  client: MongoClient;

  /**
   * MongoDb Db instance sharing the current socket connections.
   */
  db: Db;

  /**
   * Establish a connection to MongoDb and create an instance of the database.
   */
  connectToDb: (name: string, options: DbOptions, logger: string) => void;
}

export class MongoConnection implements IMongoConnection {
  client;

  db!: Db;

  constructor(
    dbConnectionUrl: string,
    options?: MongoClientOptions
  ) {
    this.client = new MongoClient(dbConnectionUrl, {
      serverApi: ServerApiVersion.v1,
      ...options,
    });
  }

  async connectToDb(name: string, options?: DbOptions) {
    console.info(`Attempting to connect to MongoDb "${name}".`);

    try {
      const startTime = Date.now();
      // Connect the client to the server
      await this.client.connect();
      // Establish connection with database
      this.db = this.client.db(name, options);
      // Verify connection to database
      const pingDocument = (await this.db.command({ ping: 1 })) as PingDocument;

      if (pingDocument.ok !== 1) {
        throw new Error('Failed to verify connection to database.');
      }

      console.info(
        `Successfully connected to MongoDb "${name}" in ${(
          Date.now() - startTime
        ).toString()}ms.`
      );
    } catch (error) {
      console.error(error as Error);
    }
  }
}
