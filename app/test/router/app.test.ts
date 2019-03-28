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
