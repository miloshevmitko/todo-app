import type { IMongoConnection } from '@todo-app/server/database';
import type { Collection } from 'mongodb';
import type { BaseEntity } from './base.entity';

/**
 * Defines a base repository class which all other repositories must extend.
 */
export class BaseRepository<T extends BaseEntity> {
  /**
   * Instance of MongoDB Collection class allowing for operations to be executed on
   * that MongoDB collection.
   */
  protected readonly collection: Collection<T>;

  /**
   * Instantiate a `BaseRepository` class.
   *
   * @param dbConnection Instance of a class that can establish connection to the database.
   * @param collectionName The name of the collection we want to access.
   */
  constructor(dbConnection: IMongoConnection, collectionName: string) {
    this.collection = dbConnection.db.collection(collectionName);
  }
}
