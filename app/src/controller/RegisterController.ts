import {Jwt, User, ErrorMsg} from "../Types"

export const registerUser = async (user: User): Promise<Jwt> => {
    return {
        jwt: "someJwt"
    }
}

