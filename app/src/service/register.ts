import {JwtResponse, User} from "../types"
import {encryptPassword} from "./encryptPassword"
import {Db} from "../postgres/Db"
import {jwtGenerator} from "./jwt"

export const registerUser = async (user: User, db: Db): Promise<JwtResponse> => {
        const hashedPassword = await encryptPassword(user.password)
        const userId = await db.saveUser(new User(user.firstName, user.lastName, user.email, hashedPassword))
        return await jwtGenerator(userId.toString())
}




