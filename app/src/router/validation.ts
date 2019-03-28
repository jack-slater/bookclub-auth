import {check} from "express-validator/check"

export const userValidationHandler = [
    check("firstName").isLength({min: 1}),
    check("lastName").isLength({min: 1}),
    check("email").isEmail(),
    check("password").isLength({min: 1})]

