import type { NextFunction, Request, Response } from 'express';
import type { Query } from 'express-serve-static-core';

/**
 * Middleware for handling exceptions inside of async express routes
 * and passing them to the express error handlers.
 */
export function asyncRouteWrapper<
  Params = Record<string, string>,
  ResBody = unknown,
  ReqBody = unknown,
  ReqQuery = Query
>(
  callback: (
    req: Request<Params, ResBody, ReqBody, ReqQuery>,
    res: Response<ResBody>,
    next: NextFunction
  ) => Promise<void>
) {
  return function routeWrapperCallback(
    req: Request<Params, ResBody, ReqBody, ReqQuery>,
    res: Response<ResBody>,
    next: NextFunction
  ) {
    callback(req, res, next).catch(next);
  };
}
