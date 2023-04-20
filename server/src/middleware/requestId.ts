import type { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'crypto';
import { globalConfig } from '@todo-app/server/configs';

export function requestId(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  const reqId = request.headers[globalConfig.requestIdHeaderKey] ?? randomUUID();
  response.set(globalConfig.requestIdHeaderKey, reqId);
  next();
}
