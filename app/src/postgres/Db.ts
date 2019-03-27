import {ErrorType, FormattedError, User} from "../types"
import * as Knex from "knex"

export class Db {
    knex: Knex

    constructor(knex: Knex) {
        this.knex = knex
    }

    public async saveUser(user: User): Promise<any> {
        try {
            return await this.knex("user").insert(this.prepareUser(user), "id")
        } catch (e) {
            this.handleError(e, user)
        }
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

    private handleError(e: any, u: User) {
        throw e.constraint === "user_email_unique"
            ? new FormattedError(ErrorType.CONFLICT, `Email ${u.email} is already in use`)
            : e
    }
}
