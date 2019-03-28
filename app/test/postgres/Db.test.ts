import sinon, {assert} from "sinon"
import uuid from "uuid"
import {Db} from "../../src/postgres/Db"
import {User} from "../../src/types"
import {knex} from "../../../db/knex"

describe("Db", () => {

    const payload: User = {
        firstName: "test",
        lastName: "user",
        email: "test@email.com",
        password: "testPassword"
    }

    beforeEach(async () => {
        await knex.migrate.rollback()
        await knex.migrate.latest()
    })

    afterEach(async () => {
        await knex.migrate.rollback()
        sinon.restore()
    })

    it("should save user", async () => {
        const randomId = "randomId"
        // @ts-ignore
        const uuidStub = sinon.stub(uuid, "v4").returns(randomId)
        const id = await new Db(knex).saveUser(payload)
        const savedValue = await select(id)

        expect(savedValue.first_name).toBe(payload.firstName)
        expect(savedValue.last_name).toBe(payload.lastName)
        expect(savedValue.email).toBe(payload.email)
        expect(savedValue.password).toBe(payload.password)
        expect(savedValue.admin).toBe(false)
        expect(savedValue.id).toBe(randomId)

        assert.called(uuidStub)
    })

    it("should throw conflict error if email is duplicate", async () => {
        const db = new Db(knex)
        const firstSave = await db.saveUser(payload)
        const savedValue = await select(firstSave)
        expect(savedValue.first_name).toBe(payload.firstName)
        await db.saveUser(payload).catch(e => {
            expect(e.statusCode).toBe(409)
            expect(e.message).toBe("Email test@email.com is already in use")
            expect(e.cause).toBe("CONFLICT")
        })
    })

    async function select(id: string) {
        const foundValues = await knex.from("user").select("*").where("id", id[0])
        return foundValues[0]
    }
})
