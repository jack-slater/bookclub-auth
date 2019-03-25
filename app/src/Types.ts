
export interface User {
    firstName: string,
    lastName: string,
    email: string,
    password: string
}

export interface Jwt {
    jwt: string,
}

export class ErrorMsg {
    statusCode: number;
    message: string;


    public constructor(statusCode: number, message: string) {
        this.statusCode = statusCode
        this.message = message
    }
}

