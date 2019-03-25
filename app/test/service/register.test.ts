import sinon from "sinon"
import {registerUser} from "../../src/service/register"
import {Jwt, User} from "../../src"
import {Db} from "../../src/postgres/Db"
import * as encrypter from "../../src/service/encryptPassword"
import * as jwt from "../../src/service/jwt"


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

    const jwtValue = {jwt: "jwt"}

    let encryptPassword: sinon.SinonStub<[string], Promise<string>>,
        jwtGenerator: sinon.SinonStub<[string], Promise<Jwt>>,
        stubbedDb: sinon.SinonStubbedInstance<Db>

    beforeEach(() => {
        encryptPassword = sinon.stub(encrypter, "encryptPassword")
        jwtGenerator = sinon.stub(jwt, "jwtGenerator")
        stubbedDb = sinon.createStubInstance(Db)
    })

    afterEach(() => {
        encryptPassword.restore()
        jwtGenerator.restore()
    })

    it("should encrypt password, save to db and generate jwt", async () => {
        encryptPassword.resolves(hashedPassword)
        stubbedDb.saveUser.resolves("userId")
        jwtGenerator.resolves(jwtValue)
        const result = await registerUser(user, stubbedDb)

        sinon.assert.calledWithExactly(encryptPassword, user.password)
        sinon.assert.calledWithMatch(stubbedDb.saveUser, userWithHashedPwd)
        sinon.assert.calledWithExactly(jwtGenerator, "userId")
        expect(result).toEqual(jwtValue)
    })

    it("should reject after encrypt error", async () => {
        const error = new Error("Unable to encrypt password")

        encryptPassword.rejects(error)
        const result = await registerUser(user, stubbedDb)

        sinon.assert.calledWithExactly(encryptPassword, user.password)
        sinon.assert.notCalled(stubbedDb.saveUser)
        sinon.assert.notCalled(jwtGenerator)
        expect(result).toEqual(error)
    })

    it("should reject after db error", async () => {
        const error = new Error("Db error")

        encryptPassword.resolves(hashedPassword)
        stubbedDb.saveUser.rejects(error)
        const result = await registerUser(user, stubbedDb)

        sinon.assert.calledWithExactly(encryptPassword, user.password)
        sinon.assert.calledWithMatch(stubbedDb.saveUser, userWithHashedPwd)
        sinon.assert.notCalled(jwtGenerator)
        expect(result).toEqual(error)
    })

    it("should reject after jwtGenerator error", async () => {
        const error = new Error("Unable to encrypt password")

        encryptPassword.resolves(hashedPassword)
        stubbedDb.saveUser.resolves("userId")
        jwtGenerator.rejects(error)
        const result = await registerUser(user, stubbedDb)

        sinon.assert.calledWithExactly(encryptPassword, user.password)
        sinon.assert.calledWithMatch(stubbedDb.saveUser, userWithHashedPwd)
        sinon.assert.calledWithExactly(jwtGenerator, "userId")
        expect(result).toEqual(error)
    })

})



