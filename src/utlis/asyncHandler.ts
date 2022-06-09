import { NextFunction, Request, Response } from 'express';

type HandlerType = (req: Request, res: Response, next: NextFunction) => Promise<any>;

export default function asyncHandler(handler: HandlerType) {
  return (req: Request, res: Response, next: NextFunction) => {
    handler(req, res, next).catch(next);
  };
}
