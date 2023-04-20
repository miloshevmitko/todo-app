import type { Request, NextFunction } from 'express';
import { HttpStatusCode } from '@todo-app/server/common';
import { TodoItem } from "./models";
import type { ITodoItemsRepository } from "./repository";
import type {
  DeleteTodoItemRequest,
  DeleteTodoItemResponse,
  GetTodoItemsResponse,
  PatchTodoItemRequest,
  PatchTodoItemResponse,
  PostTodoItemRequest,
  PostTodoItemResponse
} from './types';

export class TodoItemsController {
  private readonly todoItemsRepository: ITodoItemsRepository;

  constructor(todoItemsRepository: ITodoItemsRepository) {
    this.todoItemsRepository = todoItemsRepository;
  }

  async deleteTodoItem(request: DeleteTodoItemRequest, response: DeleteTodoItemResponse, next: NextFunction) {
    const result = await this.todoItemsRepository.deleteOneById(request.params.id);
    const status = (result.acknowledged && result.matchedCount === 1 && result.modifiedCount === 1) 
      ? HttpStatusCode.Ok 
      : HttpStatusCode.InternalServerError;

    response.status(status).json(result);
  }

  async getTodoItems(request: Request, response: GetTodoItemsResponse, next: NextFunction) {
    const todoItemsList = await this.todoItemsRepository.findAll();
    response.status(HttpStatusCode.Ok).json(todoItemsList);
  }

  async patchTodoItem(request: PatchTodoItemRequest, response: PatchTodoItemResponse, next: NextFunction) {
    const result = await this.todoItemsRepository.updateOneById(request.params.id, request.body);
    const status = (result.acknowledged && result.matchedCount === 1 && result.modifiedCount === 1) 
      ? HttpStatusCode.Ok 
      : HttpStatusCode.InternalServerError;

    response.status(status).json(result);
  }

  async postTodoItem(
    request: PostTodoItemRequest, 
    response: PostTodoItemResponse, 
    next: NextFunction
  ) {
    const todoItem = new TodoItem(request.body);
    const result = await this.todoItemsRepository.insertOne(todoItem);
    const status = result.acknowledged 
      ? HttpStatusCode.Created 
      : HttpStatusCode.InternalServerError;

    response.status(status).json(result);
  }
}