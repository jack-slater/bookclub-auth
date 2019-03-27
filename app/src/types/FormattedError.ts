import moment from "moment"
import {ErrorType} from "./ErrorType"

export class FormattedError extends Error {
    statusCode: number
    cause: string
    message: string
    timestamp: string

    public constructor(errortype: ErrorType,  message: string) {
        super()
        this.statusCode = errortype.valueOf()
        this.cause = ErrorType[errortype]
        this.message = message
        this.timestamp = moment().format()
    }
}
