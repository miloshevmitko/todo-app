import type { Request, Response, NextFunction } from 'express';
import type {
  InsertOneResult,
  UpdateResult,
} from 'mongodb';
import { ObjectId } from 'mongodb';
import { HttpStatusCode } from '@todo-app/server/common';
import { TodoItemsController } from "./controller";
import type { ITodoItemsRepository } from "./repository";
import type {
  DeleteTodoItemRequest,
  PatchTodoItemRequest,
  PostTodoItemRequest,
} from './types';
import { TodoItemEntity } from "./models";

describe('TodoItems Controller', () => {
  let todoItemsController: TodoItemsController;
  let todoItemsRepository: ITodoItemsRepository;
  let response: Response;
  let nextFunc: NextFunction;

  beforeEach(() => {
    todoItemsRepository = {
      deleteOneById: jest.fn(),
      findAll: jest.fn(),
      findOneById: jest.fn(),
      insertOne: jest.fn(),
      updateOneById: jest.fn(),
    };
    todoItemsController = new TodoItemsController(todoItemsRepository);
    response = {
      json: jest.fn(),
      status: jest.fn(),
    } as unknown as Response;
    nextFunc = jest.fn();
  });

  it('should execute deleteTodoItem with status OK', async () => {
    const request = { params: { id: 'abc123' } } as DeleteTodoItemRequest;
    const mockResult: UpdateResult = {
      acknowledged: true,
      matchedCount: 1,
      modifiedCount: 1,
      upsertedCount: 0,
      upsertedId: new ObjectId(),
    };
    const spyDeleteOneById = jest
      .spyOn(todoItemsRepository, 'deleteOneById')
      .mockImplementation(() => new Promise((resolve) => resolve(mockResult)));
    const spyResponseStatus = jest.spyOn(response, 'status').mockReturnValue(response);
    const spyResponseJson = jest.spyOn(response, 'json');
    
    await todoItemsController.deleteTodoItem(request, response, nextFunc);

    expect(spyDeleteOneById).toHaveBeenCalledTimes(1);
    expect(spyDeleteOneById).toHaveBeenCalledWith(request.params.id);
    expect(spyResponseStatus).toHaveBeenCalledWith(HttpStatusCode.Ok);
    expect(spyResponseJson).toHaveBeenCalledWith(mockResult);
  });

  it('should execute deleteTodoItem with status InternalServerError', async () => {
    const request = { params: { id: 'abc123' } } as DeleteTodoItemRequest;
    const spyResponseStatus = jest.spyOn(response, 'status').mockReturnValue(response);
    const spyResponseJson = jest.spyOn(response, 'json');

    const mockResult1: UpdateResult = {
      acknowledged: false,
      matchedCount: 1,
      modifiedCount: 1,
      upsertedCount: 0,
      upsertedId: new ObjectId(),
    };
    const spyDeleteOneById = jest
      .spyOn(todoItemsRepository, 'deleteOneById')
      .mockImplementationOnce(() => new Promise((resolve) => resolve(mockResult1)));

    await todoItemsController.deleteTodoItem(request, response, nextFunc);

    expect(spyDeleteOneById).toHaveBeenCalledTimes(1);
    expect(spyDeleteOneById).toHaveBeenCalledWith(request.params.id);
    expect(spyResponseStatus).toHaveBeenCalledWith(HttpStatusCode.InternalServerError);
    expect(spyResponseJson).toHaveBeenCalledWith(mockResult1);

    const mockResult2: UpdateResult = {
      acknowledged: true,
      matchedCount: 0,
      modifiedCount: 1,
      upsertedCount: 0,
      upsertedId: new ObjectId(),
    };
    spyDeleteOneById.mockClear();
    spyDeleteOneById.mockImplementationOnce(() => new Promise((resolve) => resolve(mockResult2)));

    await todoItemsController.deleteTodoItem(request, response, nextFunc);

    expect(spyDeleteOneById).toHaveBeenCalledTimes(1);
    expect(spyResponseStatus).toHaveBeenCalledWith(HttpStatusCode.InternalServerError);
    expect(spyResponseJson).toHaveBeenCalledWith(mockResult2);

    const mockResult3: UpdateResult = {
      acknowledged: true,
      matchedCount: 1,
      modifiedCount: 0,
      upsertedCount: 0,
      upsertedId: new ObjectId(),
    };
    spyDeleteOneById.mockClear();
    spyDeleteOneById.mockImplementationOnce(() => new Promise((resolve) => resolve(mockResult3)));

    await todoItemsController.deleteTodoItem(request, response, nextFunc);

    expect(spyDeleteOneById).toHaveBeenCalledTimes(1);
    expect(spyResponseStatus).toHaveBeenCalledWith(HttpStatusCode.InternalServerError);
    expect(spyResponseJson).toHaveBeenCalledWith(mockResult3);
  });

  it('should execute getTodoItems', async () => {
    const request = {} as Request;
    const mockResult: TodoItemEntity[] = [{} as TodoItemEntity];
    const spyFindAll = jest
      .spyOn(todoItemsRepository, 'findAll')
      .mockImplementation(() => new Promise((resolve) => resolve(mockResult)));
    const spyResponseStatus = jest.spyOn(response, 'status').mockReturnValue(response);
    const spyResponseJson = jest.spyOn(response, 'json');
    
    await todoItemsController.getTodoItems(request, response, nextFunc);

    expect(spyFindAll).toHaveBeenCalledTimes(1);
    expect(spyResponseStatus).toHaveBeenCalledWith(HttpStatusCode.Ok);
    expect(spyResponseJson).toHaveBeenCalledWith(mockResult);
  });

  it('should execute patchTodoItem with status OK', async () => {
    const request = {
      params: { id: 'abc123' },
      body: { description: 'description' }
    } as PatchTodoItemRequest;
    const mockResult: UpdateResult = {
      acknowledged: true,
      matchedCount: 1,
      modifiedCount: 1,
      upsertedCount: 0,
      upsertedId: new ObjectId(),
    };
    const spyUpdateOneById = jest
      .spyOn(todoItemsRepository, 'updateOneById')
      .mockImplementation(() => new Promise((resolve) => resolve(mockResult)));
    const spyResponseStatus = jest.spyOn(response, 'status').mockReturnValue(response);
    const spyResponseJson = jest.spyOn(response, 'json');
    
    await todoItemsController.patchTodoItem(request, response, nextFunc);

    expect(spyUpdateOneById).toHaveBeenCalledTimes(1);
    expect(spyUpdateOneById).toHaveBeenCalledWith(request.params.id, request.body);
    expect(spyResponseStatus).toHaveBeenCalledWith(HttpStatusCode.Ok);
    expect(spyResponseJson).toHaveBeenCalledWith(mockResult);
  });

  it('should execute patchTodoItem with status InternalServerError', async () => {
    const request = {
      params: { id: 'abc123' },
      body: { description: 'description' }
    } as PatchTodoItemRequest;
    const spyResponseStatus = jest.spyOn(response, 'status').mockReturnValue(response);
    const spyResponseJson = jest.spyOn(response, 'json');

    const mockResult1: UpdateResult = {
      acknowledged: false,
      matchedCount: 1,
      modifiedCount: 1,
      upsertedCount: 0,
      upsertedId: new ObjectId(),
    };
    const spyUpdateOneById = jest
      .spyOn(todoItemsRepository, 'updateOneById')
      .mockImplementationOnce(() => new Promise((resolve) => resolve(mockResult1)));

    await todoItemsController.patchTodoItem(request, response, nextFunc);

    expect(spyUpdateOneById).toHaveBeenCalledTimes(1);
    expect(spyUpdateOneById).toHaveBeenCalledWith(request.params.id, request.body);
    expect(spyResponseStatus).toHaveBeenCalledWith(HttpStatusCode.InternalServerError);
    expect(spyResponseJson).toHaveBeenCalledWith(mockResult1);

    const mockResult2: UpdateResult = {
      acknowledged: true,
      matchedCount: 0,
      modifiedCount: 1,
      upsertedCount: 0,
      upsertedId: new ObjectId(),
    };
    spyUpdateOneById.mockClear();
    spyUpdateOneById.mockImplementationOnce(() => new Promise((resolve) => resolve(mockResult2)));

    await todoItemsController.patchTodoItem(request, response, nextFunc);

    expect(spyUpdateOneById).toHaveBeenCalledTimes(1);
    expect(spyResponseStatus).toHaveBeenCalledWith(HttpStatusCode.InternalServerError);
    expect(spyResponseJson).toHaveBeenCalledWith(mockResult2);

    const mockResult3: UpdateResult = {
      acknowledged: true,
      matchedCount: 1,
      modifiedCount: 0,
      upsertedCount: 0,
      upsertedId: new ObjectId(),
    };
    spyUpdateOneById.mockClear();
    spyUpdateOneById.mockImplementationOnce(() => new Promise((resolve) => resolve(mockResult3)));

    await todoItemsController.patchTodoItem(request, response, nextFunc);

    expect(spyUpdateOneById).toHaveBeenCalledTimes(1);
    expect(spyResponseStatus).toHaveBeenCalledWith(HttpStatusCode.InternalServerError);
    expect(spyResponseJson).toHaveBeenCalledWith(mockResult3);
  });

  it('should execute postTodoItem with status OK', async () => {
    const request = { body: { description: 'description' } } as PostTodoItemRequest;
    const mockResult: InsertOneResult<TodoItemEntity> = {
      acknowledged: true,
      insertedId: new ObjectId(),
    };
    const spyInsertOne = jest
      .spyOn(todoItemsRepository, 'insertOne')
      .mockImplementation(() => new Promise((resolve) => resolve(mockResult)));
    const spyResponseStatus = jest.spyOn(response, 'status').mockReturnValue(response);
    const spyResponseJson = jest.spyOn(response, 'json');
    
    await todoItemsController.postTodoItem(request, response, nextFunc);

    expect(spyInsertOne).toHaveBeenCalledTimes(1);
    expect(spyInsertOne).toHaveBeenCalledWith(expect.objectContaining({ ...request.body }));
    expect(spyResponseStatus).toHaveBeenCalledWith(HttpStatusCode.Created);
    expect(spyResponseJson).toHaveBeenCalledWith(mockResult);
  });

  it('should execute postTodoItem with status InternalServerError', async () => {
    const request = { body: { description: 'description' } } as PostTodoItemRequest;
    const mockResult: InsertOneResult<TodoItemEntity> = {
      acknowledged: false,
      insertedId: new ObjectId(),
    };
    const spyInsertOne = jest
      .spyOn(todoItemsRepository, 'insertOne')
      .mockImplementation(() => new Promise((resolve) => resolve(mockResult)));
    const spyResponseStatus = jest.spyOn(response, 'status').mockReturnValue(response);
    const spyResponseJson = jest.spyOn(response, 'json');
    
    await todoItemsController.postTodoItem(request, response, nextFunc);

    expect(spyInsertOne).toHaveBeenCalledTimes(1);
    expect(spyInsertOne).toHaveBeenCalledWith(expect.objectContaining({ ...request.body }));
    expect(spyResponseStatus).toHaveBeenCalledWith(HttpStatusCode.InternalServerError);
    expect(spyResponseJson).toHaveBeenCalledWith(mockResult);
  });
});