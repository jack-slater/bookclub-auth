import {NextFunction, Request, Response} from "express"
import {ErrorType, FormattedError} from "../types"
import {validationResult} from "express-validator/check"

export const clientErrHandler = (err: FormattedError, req: Request, res: Response, next: NextFunction) => {
    if (err.statusCode) {
        console.error("%s: %s: %s: %s", err.statusCode, err.cause, err.message, err.stack)
        res.status(err.statusCode).send(err)
    } else {
        next(err)
    }
}

export const serverErrHander = (err: Error, req: Request, res: Response, next: NextFunction) => {
    const errorMsg = new FormattedError(ErrorType.SERVER_ERROR, err.message)
    console.error("%s: %s: %s: %s", errorMsg.statusCode, errorMsg.cause, err.message, err.stack)
    res.status(errorMsg.statusCode).send(errorMsg)
}

export const asyncMiddleware = (fn: (req: Request, res: Response, next: NextFunction) => void) =>
    (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) next(FormattedError.withValidationErr(ErrorType.BAD_REQUEST,
            "Validation Error invalid payload", errors.array()))
        else Promise.resolve(fn(req, res, next)).catch(next);
};
