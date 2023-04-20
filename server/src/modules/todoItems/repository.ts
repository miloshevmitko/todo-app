import { BaseRepository } from "@todo-app/server/common";
import type { IMongoConnection } from '@todo-app/server/database';
import type {
  InsertOneResult,
  OptionalUnlessRequiredId,
  UpdateResult,
} from 'mongodb';
import { ObjectId } from 'mongodb';
import { TodoItemEntity } from "./models";

export interface ITodoItemsRepository {
  deleteOneById(id: string): Promise<UpdateResult>;
  findAll(): Promise<TodoItemEntity[]>;
  findOneById(id: string): Promise<TodoItemEntity | null>;
  insertOne(
    todoItem: OptionalUnlessRequiredId<TodoItemEntity>
  ): Promise<InsertOneResult<TodoItemEntity>>;
  updateOneById(id: string, todoItem: Partial<TodoItemEntity>): Promise<UpdateResult>;
}

const COLLECTION_NAME = 'todo_items';

export class TodoItemsRepository extends BaseRepository<TodoItemEntity> implements ITodoItemsRepository {
  constructor(dbConnection: IMongoConnection) {
    super(dbConnection, COLLECTION_NAME);
  }

  async deleteOneById(id: string): Promise<UpdateResult> {
    return this.collection.updateOne(
      { _id: new ObjectId(id), deletedAt: null },
      { $currentDate: { deletedAt: { $type: 'date' } } },
    );
  }

  async findAll(): Promise<TodoItemEntity[]> {
    return this.collection.find({ deletedAt: null }).sort({ createdAt: -1 }).toArray();
  }

  async findOneById(id: string): Promise<TodoItemEntity | null> {
    return this.collection.findOne({ _id: new ObjectId(id), deletedAt: null });
  }

  async insertOne(
    todoItem: OptionalUnlessRequiredId<TodoItemEntity>
  ): Promise<InsertOneResult<TodoItemEntity>> {
    return this.collection.insertOne(todoItem);
  }

  async updateOneById(id: string, todoItem: Partial<TodoItemEntity>): Promise<UpdateResult> {
    return this.collection.updateOne(
      { _id: new ObjectId(id), deletedAt: null },
      {
        $currentDate: { updatedAt: { $type: 'date' } },
        $set: { ...todoItem },
      },
    );
  }
}
