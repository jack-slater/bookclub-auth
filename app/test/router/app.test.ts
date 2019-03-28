import request from "supertest"
import sinon from "sinon"
import {app} from "../../src/router/app"
import {ErrorType, FormattedError, JwtResponse, User} from "../../src/types"
import {Db} from "../../src/postgres/Db"
import * as register from "../../src/service/register"
import {knex} from "../../../db/knex"

describe("app", () => {

    const payload: User = {
        firstName: "test",
        lastName: "user",
        email: "test@email.com",
        password: "testPassword"
    }

    const db = new Db(knex)

    let regUser: sinon.SinonStub<[User, Db], Promise<JwtResponse>>

    beforeEach(() => {
        regUser = sinon.stub(register, "registerUser")
    })

    afterEach(() => {
        regUser.restore()
    })

    it("should successfully POST new user", async () => {
        const jwt: JwtResponse = {jwt: "test"}
        regUser.resolves(jwt)

        const response = await request(app).post("/register").send(payload)
        sinon.assert.calledWithExactly(regUser, payload, db)
        expect(response.status).toBe(201);
        expect(response.body).toEqual(jwt);
    });

    it("should throw error when payload when values are empty", async () => {
        const emptyPayload = {
            firstName: "",
            lastName: "",
            email: "",
            password: ""
        }

        const response = await request(app).post("/register").send(emptyPayload)
        const {statusCode, cause, message, validationErrors} = response.body

        expect(statusCode).toBe(400)
        expect(cause).toBe("BAD_REQUEST")
        expect(message).toBe("Validation Error invalid payload")
        expect(validationErrors).toEqual([
            {"location": "body", "msg": "Invalid value", "param": "firstName", "value": ""},
            {"location": "body", "msg": "Invalid value", "param": "lastName", "value": ""},
            {"location": "body", "msg": "Invalid value", "param": "email", "value": ""},
            {"location": "body", "msg": "Invalid value", "param": "password", "value": ""}])
    });

    it("should throw error payload when values are undefined", async () => {
        const emptyPayload = {}

        const response = await request(app).post("/register").send(emptyPayload)
        const {statusCode, cause, message, validationErrors} = response.body

        expect(statusCode).toBe(400)
        expect(cause).toBe("BAD_REQUEST")
        expect(message).toBe("Validation Error invalid payload")
        expect(validationErrors).toEqual([
            {"location": "body", "msg": "Invalid value", "param": "firstName"},
            {"location": "body", "msg": "Invalid value", "param": "lastName"},
            {"location": "body", "msg": "Invalid value", "param": "email"},
            {"location": "body", "msg": "Invalid value", "param": "password"}])
    });

    it("should throw error payload when email is not valid", async () => {
        const invaidEmail: User = {
            firstName: "test",
            lastName: "user",
            email: "testemail.com",
            password: "testPassword"
        }

        const response = await request(app).post("/register").send(invaidEmail)
        const {statusCode, cause, message, validationErrors} = response.body

        expect(statusCode).toBe(400)
        expect(cause).toBe("BAD_REQUEST")
        expect(message).toBe("Validation Error invalid payload")
        expect(validationErrors).toEqual([
            {"location": "body", "msg": "Invalid value", "param": "email", "value": "testemail.com"}])
    });

    it("should send errorMsg POST", async () => {
        const errorMsg = new FormattedError(ErrorType.NOT_FOUND, "No user found")
        regUser.rejects(errorMsg)
        const response = await request(app).post("/register").send(payload)
        const {statusCode, cause, message} = response.body

        sinon.assert.calledWithExactly(regUser, payload, db)
        expect(response.status).toBe(404);
        expect(statusCode).toBe(errorMsg.statusCode)
        expect(cause).toBe(errorMsg.cause)
        expect(message).toBe(errorMsg.message)
    });

    it("should send server error POST for non specified error", async () => {
        const error = new Error()
        regUser.rejects(error)
        const response = await request(app).post("/register").send(payload)
        const {statusCode, cause, message} = response.body

        sinon.assert.calledWithExactly(regUser, payload, db)
        expect(response.status).toBe(500);
        expect(statusCode).toBe(500)
        expect(cause).toBe("SERVER_ERROR")
        expect(message).toBe(error.message)
    });

})
