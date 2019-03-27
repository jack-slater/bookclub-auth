import {NextFunction, Request, Response} from "express"
import {ErrorMsg} from "../Types"

export const clientErrHandler = (err: ErrorMsg, req: Request, res: Response, next: NextFunction) => {
    if (err.statusCode) {
        console.error("%s: %s: %s: %s", err.statusCode, err.cause, err.message, err.stack)
        res.status(err.statusCode).send(err)
    }
    next(err)
}

export const serverErrHander = (err: Error, req: Request, res: Response, next: NextFunction) => {
    const errorMsg = new ErrorMsg(500, "Server Error", err.message)
    console.error("%s: %s: %s: %s", errorMsg.statusCode, errorMsg.cause, err.message, err.stack)
    res.status(errorMsg.statusCode).send(errorMsg)
}

export const asyncMiddleware = (fn: (req: Request, res: Response, next: NextFunction) => void) =>
    (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};
