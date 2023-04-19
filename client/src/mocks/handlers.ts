import { rest } from 'msw';
import { appConfig } from '@todo-app/client/configs';

export const handlers = [
  rest.get(`${appConfig.apiBaseUrl}/todo-items`, (req, res, ctx) => {
    return res(ctx.json([]));
  }),

  rest.post(`${appConfig.apiBaseUrl}/todo-items`, async (req, res, ctx) => {
    await req.json(); // To get the request body
    return res(ctx.status(200), ctx.json({ acknowledged: true, insertedId: '1' }));
  }),

  rest.patch(`${appConfig.apiBaseUrl}/todo-items/:id`, async (req, res, ctx) => {
    await req.json();// To get the request body
    const { id } = req.params;
    return res(ctx.status(200), ctx.json({
      acknowledged: true,
      matchedCount: 1,
      modifiedCount: 1,
      upsertedId: id,
    }));
  }),

  rest.delete(`${appConfig.apiBaseUrl}/todo-items/:id`, (req, res, ctx) => {
    const { id } = req.params;
    return res(ctx.status(200), ctx.json({
      acknowledged: true,
      matchedCount: 1,
      modifiedCount: 1,
      upsertedId: id,
    }));
  }),
];