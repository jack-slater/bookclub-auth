import bcrypt from "bcrypt"

export const encryptPassword = async (password: string): Promise<string> => {
    return await bcrypt.hash(password, 10)
}
