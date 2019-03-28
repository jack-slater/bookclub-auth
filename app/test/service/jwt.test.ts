import jwt, {SignOptions} from "jsonwebtoken"
import sinon, {assert} from "sinon"
import {jwtGenerator} from "../../src/service/jwt"

describe("jwtGenerator", () => {

    const userId = "123"
    const signOptions: SignOptions = {expiresIn: 86400, subject: userId}

    beforeEach(() => {
        Object.assign(process.env, {JWT_SECRET: "veryVerySecret"})
    })

    afterEach(() => {
        delete process.env.JWT_SECRET
        sinon.restore()
    })

    it("should generate jwt with subject and role", async () => {
        const token = await jwtGenerator(userId)
        const decoded: any = jwt.decode(token.jwt, {json: true})

        expect(decoded.sub).toBe(userId)
        expect(decoded.role).toBe("user")
    })

    it("should call jwt.sign with secret and expiry option", async () => {
        const signSpy = sinon.spy(jwt, "sign")
        await jwtGenerator(userId)
        // @ts-ignore overloaded method not recognised
        assert.calledWithMatch(signSpy, {role: "user"}, "veryVerySecret", signOptions)
    })

    it("should throw with message prefixed with Error Generating Jwt", async () => {
        sinon.stub(jwt, "sign").rejects("some error")
        await jwtGenerator(userId).catch(e => {
            expect(e.message).toContain("Error Generating Jwt:")
        })
    })

    it("should throw with message if JWT_SECRET is undefined", async () => {
        Object.assign(process.env, {JWT_SECRET: undefined})
        await jwtGenerator(userId).catch(e => {
            expect(e.message).toBe("Error Generating Jwt: No secret to sign jwt provided")
        })
    })
})
