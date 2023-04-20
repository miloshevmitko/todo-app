import type {
  Collection,
  FindCursor,
  InsertOneResult,
  UpdateResult,
} from 'mongodb';
import { ObjectId } from 'mongodb';
import type { IMongoConnection } from '@todo-app/server/database';
import { TodoItemsRepository } from "./repository";
import { TodoItemEntity } from "./models";

describe('TodoItems repository', () => {
  let todoItemsRepository: TodoItemsRepository;
  let mongoConnection: IMongoConnection;
  let mockCollection: Collection<TodoItemEntity>;

  beforeEach(() => {
    mockCollection = {
      updateOne: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      insertOne: jest.fn(),
      sort: jest.fn(),
      toArray: jest.fn()
    } as unknown as Collection<TodoItemEntity>;
    mongoConnection = {
      db: {
        collection: jest.fn().mockReturnValue(mockCollection),
      },
    } as unknown as IMongoConnection;

    todoItemsRepository = new TodoItemsRepository(mongoConnection);
  });

  it('should execute deleteOneById', async () => {
    const mockId = '654a604aba60e2bff2f7d70a';
    const mockResult = new Promise<UpdateResult>((resolve) => resolve({} as UpdateResult));
    const spyUpdateOne = jest
      .spyOn(mockCollection, 'updateOne')
      .mockImplementation(() => mockResult);

    const result = todoItemsRepository.deleteOneById(mockId);

    expect(result).toEqual(mockResult);
    expect(spyUpdateOne).toHaveBeenCalledTimes(1);
    expect(spyUpdateOne).toHaveBeenCalledWith(
      expect.objectContaining({ _id: new ObjectId(mockId), deletedAt: null }),
      expect.any(Object)
    );
  });

  it('should execute findAll', async () => {
    const mockResult = new Promise<TodoItemEntity[]>((resolve) => resolve([] as TodoItemEntity[]));
    const mockCursor = {
      sort: function () { return this; },
      toArray: jest.fn().mockImplementation(() => mockResult),
    } as unknown as FindCursor<Document>;
    const spyFind = jest
      .spyOn(mockCollection, 'find')
      .mockImplementation(() => mockCursor);
    const spyCursorSort = jest.spyOn(mockCursor, 'sort');
    const spyCursorToArray = jest.spyOn(mockCursor, 'toArray');

    const result = todoItemsRepository.findAll();
    expect(spyFind).toHaveBeenCalledTimes(1);
    expect(spyFind).toHaveBeenCalledWith({ deletedAt: null });
    expect(spyCursorSort).toHaveBeenCalledTimes(1);
    expect(spyCursorSort).toHaveBeenCalledWith({ createdAt: -1 });
    expect(spyCursorToArray).toHaveBeenCalledTimes(1);
  });

  it('should execute findOneById', async () => {
    const mockId = '654a604aba60e2bff2f7d70a';
    const mockResult = new Promise<TodoItemEntity | null>((resolve) => resolve({} as TodoItemEntity | null));
    const spyFindOne = jest
      .spyOn(mockCollection, 'findOne')
      .mockImplementation(() => mockResult);

    const result = todoItemsRepository.findOneById(mockId);

    expect(result).toEqual(mockResult);
    expect(spyFindOne).toHaveBeenCalledTimes(1);
    expect(spyFindOne).toHaveBeenCalledWith(
      expect.objectContaining({ _id: new ObjectId(mockId), deletedAt: null })
    );
  });

  it('should execute insertOne', async () => {
    const mockBody = { description: 'description' } as TodoItemEntity;
    const mockResult = new Promise<InsertOneResult<TodoItemEntity>>(
      (resolve) => resolve({} as InsertOneResult<TodoItemEntity>)
    );
    const spyInsertOne = jest
      .spyOn(mockCollection, 'insertOne')
      .mockImplementation(() => mockResult);

    const result = todoItemsRepository.insertOne(mockBody);

    expect(result).toEqual(mockResult);
    expect(spyInsertOne).toHaveBeenCalledTimes(1);
    expect(spyInsertOne).toHaveBeenCalledWith(mockBody);
  });

  it('should execute updateOneById', async () => {
    const mockId = '654a604aba60e2bff2f7d70a';
    const mockUpdate = { description: 'description' };
    const mockResult = new Promise<UpdateResult>((resolve) => resolve({} as UpdateResult));
    const spyUpdateOne = jest
      .spyOn(mockCollection, 'updateOne')
      .mockImplementation(() => mockResult);

    const result = todoItemsRepository.updateOneById(mockId, mockUpdate);

    expect(result).toEqual(mockResult);
    expect(spyUpdateOne).toHaveBeenCalledTimes(1);
    expect(spyUpdateOne).toHaveBeenCalledWith(
      expect.objectContaining({ _id: new ObjectId(mockId), deletedAt: null }),
      expect.objectContaining({ $set: { ...mockUpdate } }),
    );
  });
});