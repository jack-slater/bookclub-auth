import express, {NextFunction, Request, Response} from 'express';
import {User} from "./Types"
import {asyncMiddleware, clientErrHandler, serverErrHander} from "./middleware"
import {registerUser} from "./controller/RegisterController";

const app: express.Application = express();

app.use(express.json())

app.post('/register', asyncMiddleware(async (req: Request, res: Response, next: NextFunction) => {
    const payload: User = req.body
    const jwt = await registerUser(payload)
    res.status(201).send(jwt)
}));

app.use(clientErrHandler)
app.use(serverErrHander)

export {app};


