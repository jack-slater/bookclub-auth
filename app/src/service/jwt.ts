import jwt from "jsonwebtoken"
import {Jwt} from "../Types"

export const jwtGenerator = async (userId: string): Promise<Jwt> => {
    const generatedJwt = await jwt.sign({}, "secret")
    return {jwt: generatedJwt}
}
