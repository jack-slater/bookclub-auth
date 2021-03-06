import sinon from "sinon"
import {registerUser} from "../../src/service/register"
import {JwtResponse, User} from "../../src/types"
import {Db} from "../../src/postgres/Db"
import * as encrypter from "../../src/service/encryptPassword"
import * as jwt from "../../src/service/jwt"
import {knex} from "../../../db/knex"


describe("registerUser", () => {

    const user: User = {
        firstName: "test",
        lastName: "user",
        email: "test@email.com",
        password: "testPassword"
    }

    const hashedPassword = "hashedPassword"

    const userWithHashedPwd: User = {
        firstName: "test",
        lastName: "user",
        email: "test@email.com",
        password: hashedPassword
    }

    const db = new Db(knex)

    const jwtValue = {jwt: "jwt"}

    let encryptPassword: sinon.SinonStub<[string], Promise<string>>,
        jwtGenerator: sinon.SinonStub<[string], Promise<JwtResponse>>,
        saveUser: sinon.SinonStub<[User], Promise<any>>

    beforeEach(() => {
        encryptPassword = sinon.stub(encrypter, "encryptPassword")
        jwtGenerator = sinon.stub(jwt, "jwtGenerator")
        saveUser = sinon.stub(Db.prototype, "saveUser")
    })

    afterEach(() => {
        encryptPassword.restore()
        jwtGenerator.restore()
        saveUser.restore()
    })

    it("should encrypt password, save to db and generate jwt", async () => {
        encryptPassword.resolves(hashedPassword)
        saveUser.resolves("userId")
        jwtGenerator.resolves(jwtValue)
        const result = await registerUser(user, db)

        sinon.assert.calledWithExactly(encryptPassword, user.password)
        sinon.assert.calledWithMatch(saveUser, userWithHashedPwd)
        sinon.assert.calledWithExactly(jwtGenerator, "userId")
        expect(result).toEqual(jwtValue)
    })

    it("should convert numeric id to string", async () => {
        encryptPassword.resolves(hashedPassword)
        saveUser.resolves(123)
        jwtGenerator.resolves(jwtValue)
        const result = await registerUser(user, db)

        sinon.assert.calledWithExactly(jwtGenerator, "123")
        expect(result).toEqual(jwtValue)
    })

    it("should reject after encrypt error", async () => {
        const error = new Error("Unable to encrypt password")
        encryptPassword.rejects(error)
        await registerUser(user, db).catch(e => {
            sinon.assert.calledWithExactly(encryptPassword, user.password)
            sinon.assert.notCalled(saveUser)
            sinon.assert.notCalled(jwtGenerator)
            expect(e).toEqual(error)
        })
    })

    it("should reject after db error", async () => {
        const error = new Error("Db error")

        encryptPassword.resolves(hashedPassword)
        saveUser.rejects(error)
        await registerUser(user, db).catch(e => {
            sinon.assert.calledWithExactly(encryptPassword, user.password)
            sinon.assert.calledWithMatch(saveUser, userWithHashedPwd)
            sinon.assert.notCalled(jwtGenerator)
            expect(e).toEqual(error)
        })
    })

    it("should reject after jwtGenerator error", async () => {
        const error = new Error("JwtResponse generator error")

        encryptPassword.resolves(hashedPassword)
        saveUser.resolves("userId")
        jwtGenerator.rejects(error)
        await registerUser(user, db).catch(e => {
            sinon.assert.calledWithExactly(encryptPassword, user.password)
            sinon.assert.calledWithMatch(saveUser, userWithHashedPwd)
            sinon.assert.calledWithExactly(jwtGenerator, "userId")
            expect(e).toEqual(error)
        })
    })

})



