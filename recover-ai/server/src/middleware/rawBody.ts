import { Request, Response, NextFunction } from 'express';

export interface RequestWithRawBody extends Request {
  rawBody?: Buffer;
}

export function rawBodyMiddleware(req: RequestWithRawBody, res: Response, next: NextFunction) {
  let data = Buffer.from('');
  req.on('data', (chunk) => {
    data = Buffer.concat([data, chunk]);
  });
  req.on('end', () => {
    req.rawBody = data;
    next();
  });
}
