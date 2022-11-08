import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'
import * as dotenv from 'dotenv'
import * as dotenvExpand from 'dotenv-expand'
dotenvExpand.expand(dotenv.config())
const PREFIX = process.env.USER_SERVICE_PREFIX
const PORT = process.env.USER_SERVICE_PORT

const app = express();
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors({
    origin: ['http://localhost:3000'],
    credentials: true,
})) // config cors so that front-end can use
app.options('*', cors())

import apiRoutes from './routes/api-routes.js'
app.use(PREFIX, apiRoutes).all((_, res) => {
    res.setHeader('content-type', 'application/json')
    res.setHeader('Access-Control-Allow-Origin', '*')
})

const router = express.Router()
router.get('/', (_, res) => res.send('Hello World from user-service'))

app.listen(PORT, () => console.log(`User Service listening on port ${PORT} with prefix ${PREFIX}`));

