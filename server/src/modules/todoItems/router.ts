import { Router } from 'express';
import { mongoConnection } from '@todo-app/server/database';
import { asyncRouteWrapper } from '@todo-app/server/utils';
import { TodoItemsController } from './controller';
import { TodoItemsRepository } from './repository';

const controller = new TodoItemsController(new TodoItemsRepository(mongoConnection));

export const todoItemsBaseRoute = '/v1/todo-items';

export const todoItemsRouter = Router();

todoItemsRouter
  .route('/')
  .get(asyncRouteWrapper(controller.getTodoItems.bind(controller)))
  .post(asyncRouteWrapper(controller.postTodoItem.bind(controller)));

todoItemsRouter
  .route('/:id')
  .delete(asyncRouteWrapper(controller.deleteTodoItem.bind(controller)))
  .patch(asyncRouteWrapper(controller.patchTodoItem.bind(controller)));