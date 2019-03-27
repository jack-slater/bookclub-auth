import {Db} from "../../src/postgres/Db"
import {User} from "../../src"
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
    })

    it("should save user", async () => {
        const id = await new Db(knex).saveUser(payload)
        const savedValue = await select(id)

        expect(savedValue.first_name).toBe(payload.firstName)
        expect(savedValue.last_name).toBe(payload.lastName)
        expect(savedValue.email).toBe(payload.email)
        expect(savedValue.password).toBe(payload.password)
        expect(savedValue.id).toBe(id[0])
    })

    it("should throw error if email is duplicate", async () => {
        const db = new Db(knex)
        try {
            const firstSave = await db.saveUser(payload)
            const savedValue = await select(firstSave)
            expect(savedValue.first_name).toBe(payload.firstName)
            await db.saveUser(payload)
        } catch (e) {
            expect(e.name).toBe("error")
            expect(e.detail).toBe('Key (email)=(test@email.com) already exists.')
        }
    })

    async function select(id: string) {
        const foundValues = await knex.from("user").select("*").where("id", id[0])
        return foundValues[0]
    }
})
