import bcrypt from "bcrypt"
import {encryptPassword} from "../../src/service/encryptPassword"

describe("encryptPassword", () => {
    const firstPassword = "firstPassword"
    const secondPassword = "secondPassword"

    it("should encrypt password", async () => {
        const firstEncrypted = await encryptPassword(firstPassword)
        const secondEncrypted = await encryptPassword(secondPassword)

        expect(firstEncrypted).not.toBe(firstPassword)
        expect(secondEncrypted).not.toBe(secondPassword)
        expect(firstEncrypted).not.toBe(secondEncrypted)
    })

    it("should encrypt password to match with bcrypt", async () => {
        const firstEncrypted = await encryptPassword(firstPassword)

        const match = await bcrypt.compare(firstPassword, firstEncrypted)
        const nonMatch = await bcrypt.compare(secondPassword, firstEncrypted)
        expect(match).toBeTruthy()
        expect(nonMatch).toBeFalsy()
    })
})
