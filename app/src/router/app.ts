import express, {NextFunction, Request, Response} from 'express';
import {User} from "../Types"
import {asyncMiddleware, clientErrHandler, serverErrHander} from "./middleware"
import {registerUser} from "../service/register"
import {Db} from "../postgres/Db"

const app: express.Application = express();
const db: Db = new Db()

app.use(express.json())

app.post('/register', asyncMiddleware(async (req: Request, res: Response, next: NextFunction) => {
    const payload: User = req.body
    const jwt = await registerUser(payload, db)
    res.status(201).send(jwt)
}))

app.use(clientErrHandler)
app.use(serverErrHander)

export {app};


