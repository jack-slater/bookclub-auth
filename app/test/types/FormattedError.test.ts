import {fn as momentProto} from "moment"
import sinon from "sinon"
import {ErrorType, FormattedError} from "../../src/types"

describe("FormattedError", () => {

    it("should add current timestamp on creation", () => {

        const formattedTime = "formatted time"
        sinon.stub(momentProto, "format").returns(formattedTime)

        const message = "something has broke"
        const formattedError = new FormattedError(ErrorType.SERVER_ERROR, message )

        expect(formattedError.cause).toBe("SERVER_ERROR")
        expect(formattedError.statusCode).toBe(500)
        expect(formattedError.message).toBe(message)
        expect(formattedError.timestamp).toBe(formattedTime)

        sinon.restore()
    })

    it("should create error with validationErrors", () => {
        const validationErrors = [{validation: "error"}]
        const message = "something has broke"
        const formattedError = FormattedError.withValidationErr(ErrorType.SERVER_ERROR, message , validationErrors)

        expect(formattedError.cause).toBe("SERVER_ERROR")
        expect(formattedError.statusCode).toBe(500)
        expect(formattedError.message).toBe(message)
        expect(formattedError.validationErrors).toEqual(validationErrors)
    })
})
