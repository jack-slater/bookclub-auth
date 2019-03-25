import request from "supertest"
import sinon from "sinon"
import {app} from "../src/router/app"
import {ErrorMsg, Jwt, User} from "../src"
import {Db} from "../src/postgres/Db"
import * as register from "../src/service/register"

describe("app", () => {

    const payload: User = {
        firstName: "test",
        lastName: "user",
        email: "test@email.com",
        password: "testPassword"
    }

    const db = new Db()

    let regUser: sinon.SinonStub<[User, Db], Promise<Jwt>>

    beforeEach(() => {
        regUser = sinon.stub(register, "registerUser")
    })

    afterEach(() => {
        regUser.restore()
    })

    it("should successfully POST new user", async () => {
        const jwt: Jwt = {jwt: "test"}
        regUser.resolves(jwt)

        const response = await request(app).post("/register").send(payload)
        sinon.assert.calledWithExactly(regUser, payload, db)
        expect(response.status).toBe(201);
        expect(response.body).toEqual(jwt);
    });

    it("should send errorMsg POST", async () => {
        const errorMsg = new ErrorMsg(404, "Not Found", "No user found")
        regUser.rejects(errorMsg)

        const response = await request(app).post("/register").send(payload)
        sinon.assert.calledWithExactly(regUser, payload, db)
        expect(response.status).toBe(404);
        expect(response.body).toEqual(errorMsg);
    });

    it("should send server error POST for non specified error", async () => {
        const error = new Error()
        regUser.rejects(error)
        const response = await request(app).post("/register").send(payload)
        sinon.assert.calledWithExactly(regUser, payload, db)
        expect(response.status).toBe(500);
        expect(response.body).toEqual(new ErrorMsg(500, "Server Error", error.message));
    });

})
