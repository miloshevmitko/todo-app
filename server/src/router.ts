import { Router } from 'express';

export const router = Router();

import('./modules/todoItems').then((module) => {
  return router.use(module.todoItemsBaseRoute, module.todoItemsRouter);
});