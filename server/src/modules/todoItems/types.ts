import type { Request, Response } from 'express';
import type {
  ParamsDictionary,
} from 'express-serve-static-core';
import type {
  InsertOneResult,
  UpdateResult,
} from 'mongodb';
import { TodoItemEntity } from "./models";


export type DeleteTodoItemRequest = Request<{ id: string; }>;

export type DeleteTodoItemResponse = Response<UpdateResult>;

export type GetTodoItemsResponse = Response<TodoItemEntity[]>;

export type PostTodoItemRequest = Request<ParamsDictionary, any, { description: string; }>;

export type PostTodoItemResponse = Response<InsertOneResult<TodoItemEntity>>;

export type PatchTodoItemRequest = Request<{ id: string; }, any, { description: string; }>;

export type PatchTodoItemResponse = Response<UpdateResult>;