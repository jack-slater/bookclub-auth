import express, {NextFunction, Request, Response} from 'express';
import {knex} from "../../../db/knex"
import morgan from "morgan"
import {asyncMiddleware, clientErrHandler, serverErrHander} from "./middleware"
import {registerUser} from "../service/register"
import {Db} from "../postgres/Db"
import {User} from "../types/"

const app: express.Application = express();
const db: Db = new Db(knex)

app.use(express.json())
app.use(morgan("dev"))

app.post('/register', asyncMiddleware(async (req: Request, res: Response, next: NextFunction) => {
    const payload: User = req.body
    const jwt = await registerUser(payload, db)
    res.status(201).send(jwt)
}))

app.use(clientErrHandler)
app.use(serverErrHander)

export {app};


