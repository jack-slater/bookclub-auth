import moment from "moment"
import {ErrorType} from "./ErrorType"

export class FormattedError extends Error {
    statusCode: number
    cause: string
    message: string
    timestamp: string
    validationErrors?: object

    public constructor(errortype: ErrorType,  message: string) {
        super()
        this.statusCode = errortype.valueOf()
        this.cause = ErrorType[errortype]
        this.message = message
        this.timestamp = moment().format()
    }

    public static withValidationErr(errortype: ErrorType,  message: string, validationErr: object) {
        const newErr = new FormattedError(errortype, message)
        newErr.validationErrors = validationErr
        return newErr
    }
}
