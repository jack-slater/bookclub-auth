import {Jwt, User} from "../Types"
import {encryptPassword} from "./encryptPassword"
import {Db} from "../postgres/Db"
import {jwtGenerator} from "./jwt"

export const registerUser = async (user: User, db: Db): Promise<Jwt> => {
    try {
        const hashedPassword = await encryptPassword(user.password)
        const userId = await db.saveUser(new User(user.firstName, user.lastName, user.email, hashedPassword))
        return await jwtGenerator(userId)
    } catch (e) {
        return await e
    }
}




