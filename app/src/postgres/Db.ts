import {User} from "../Types"
import * as Knex from "knex"

export class Db {
    knex: Knex

    constructor(knex: Knex) {
        this.knex = knex
    }

    public async saveUser(user: User): Promise<any> {
        return await this.knex("user").insert(this.prepareUser(user), "id")
    }

    private prepareUser(user: User): object {
        return {
            "first_name": user.firstName,
            "last_name": user.lastName,
            "email": user.email,
            "password": user.password,
            "created_at": new Date(),
        }
    }
}
