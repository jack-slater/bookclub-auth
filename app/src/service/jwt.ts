import jwt, {SignOptions} from "jsonwebtoken"
import {ErrorType, FormattedError, JwtResponse} from "../types"

export const jwtGenerator = async (userId: string): Promise<JwtResponse> => {
    if (!process.env.JWT_SECRET) throw jwtError("No secret to sign jwt provided")
    return await signJwt(userId, process.env.JWT_SECRET)
}

async function signJwt(userId: string, jwtSecret: string) {
    try {
        const signOptions: SignOptions = {expiresIn: 86400, subject: userId}
        const generatedJwt = await jwt.sign({role: "user"}, jwtSecret, signOptions)
        return {jwt: generatedJwt}
    } catch (e) {
        throw jwtError(e.message)
    }
}

const jwtError = (message: string) => {
    return new FormattedError(ErrorType.SERVER_ERROR, `Error Generating Jwt: ${message}`)
}
