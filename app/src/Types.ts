
export class User {
    firstName: string
    lastName: string
    email: string
    password: string

    constructor(firstName: string, lastName: string, email: string, password: string) {
        this.firstName = firstName
        this.lastName = lastName
        this.email = email
        this.password = password
    }
}

export interface Jwt {
    jwt: string,
}

export class ErrorMsg extends Error {
    statusCode: number
    cause: string
    message: string

    public constructor(statusCode: number, cause: string,  message: string) {
        super()
        this.statusCode = statusCode
        this.cause = cause
        this.message = message
    }
}

