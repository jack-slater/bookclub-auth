import express, {NextFunction, Request, Response} from 'express';
import {knex} from "../../../db/knex"
import {asyncMiddleware, clientErrHandler, serverErrHander, winstonErrorLogger, winstonReqLogger} from "./middleware"
import {registerUser} from "../service/register"
import {Db} from "../postgres/Db"
import {User} from "../types/"
import {userValidationHandler} from "./validation"
import morgan from "morgan"

const app: express.Application = express();
const router: express.Router = express.Router();
const db: Db = new Db(knex)

app.use(express.json())
app.use(morgan("dev"))
app.use(winstonReqLogger)

router.post('/register', userValidationHandler, asyncMiddleware(async (req: Request, res: Response, next: NextFunction) => {
    const payload: User = req.body
    const jwt = await registerUser(payload, db)
    res.status(201).send(jwt)

}))

app.use(router)

app.use(winstonErrorLogger)
app.use(clientErrHandler)
app.use(serverErrHander)

export {app};


