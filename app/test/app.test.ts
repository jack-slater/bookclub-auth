import request from "supertest"
import sinon from "sinon"
import {app, ErrorMsg, Jwt, User} from "../src"
import * as RegisterController from "../src/controller/RegisterController"
import {registerUser} from "../src/controller/RegisterController"

describe("app", () => {

    const payload: User = {
        firstName: "test",
        lastName: "user",
        email: "test@email.com",
        password: "testPassword"
    }

    let regUser: sinon.SinonStub<[User], Promise<Jwt>>

    beforeEach(() => {
        regUser = sinon.stub(RegisterController, "registerUser")
    })

    afterEach(() => {
        regUser.restore()
    })

    it("should successfully POST new user", async () => {
        const jwt: Jwt = {jwt: "test"}
        regUser.resolves(jwt)

        const response = await request(app).post("/register").send(payload)
        sinon.assert.calledWithExactly(regUser, payload)
        expect(response.status).toBe(201);
        expect(response.body).toEqual(jwt);
    });

    it("should send errorMsg POST", async () => {
        const errorMsg = new ErrorMsg(404, "Not Found")
        regUser.rejects(errorMsg)

        const response = await request(app).post("/register").send(payload)
        sinon.assert.calledWithExactly(regUser, payload)
        expect(response.status).toBe(404);
        expect(response.body).toEqual(errorMsg);
    });

    it("should send server error POST for non specified error", async () => {
        regUser.rejects(new Error())

        const response = await request(app).post("/register").send(payload)
        sinon.assert.calledWithExactly(regUser, payload)
        expect(response.status).toBe(500);
        expect(response.body).toEqual(new ErrorMsg(500, "Server Error"));
    });

})
