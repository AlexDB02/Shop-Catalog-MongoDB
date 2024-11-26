import { Request, Response, NextFunction, RequestHandler } from "express";

export const asyncHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) => {

  Promise.resolve(fn(req, res, next)).then(() => undefined).catch(next);

};