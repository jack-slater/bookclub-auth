import {ErrorRequestHandler, NextFunction, Request, Response} from "express"
import {ErrorMsg} from "../Types"

export const clientErrHandler = (err: ErrorRequestHandler, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof ErrorMsg) {
        res.status(err.statusCode).send(err)
    }
    next(err)
}

export const serverErrHander = (err: ErrorEvent, req: Request, res: Response, next: NextFunction) => {
    res.status(500).send(new ErrorMsg(500, "Server Error", err.message))
}

export const asyncMiddleware = (fn: (req: Request, res: Response, next: NextFunction) => void) =>
    (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};
