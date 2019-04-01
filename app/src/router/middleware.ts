import {NextFunction, Request, Response} from "express"
import {ErrorType, FormattedError} from "../types"
import {validationResult} from "express-validator/check"
import expressWinston from "express-winston"
import * as winston from "winston"

export const clientErrHandler = (err: FormattedError, req: Request, res: Response, next: NextFunction) => {
    if (err.statusCode) {
        res.status(err.statusCode).send(err)
    } else {
        next(err)
    }
}

export const serverErrHander = (err: Error, req: Request, res: Response, next: NextFunction) => {
    const errorMsg = new FormattedError(ErrorType.SERVER_ERROR, err.message)
    res.status(errorMsg.statusCode).send(errorMsg)
}

export const asyncMiddleware = (fn: (req: Request, res: Response, next: NextFunction) => void) =>
    (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) next(FormattedError.withValidationErr(ErrorType.BAD_REQUEST,
            "Validation Error invalid payload", errors.array()))
        else Promise.resolve(fn(req, res, next)).catch(next);
};

export const winstonErrorLogger = expressWinston.errorLogger({
    transports: [
        new winston.transports.File({
            level: 'error',
            filename: './logs/error.log'
        })
    ],
    // @ts-ignore
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.json()
    )
})

export const winstonReqLogger = expressWinston.logger({
    transports: [
        new winston.transports.File({
            filename: './logs/combined.log'
        })
    ],
    // @ts-ignore
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.json()
    )
})
