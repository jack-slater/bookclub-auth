import {config} from "dotenv"
import {app} from "./router/app"

config()

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});
