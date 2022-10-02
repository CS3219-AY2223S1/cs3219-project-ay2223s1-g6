import express from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
const app = express();
dotenv.config()

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cookieParser());
app.use(cors()) // config cors so that front-end can use
app.options('*', cors())


import { 
    changePassword, 
    createUser, 
    deleteUser, 
    userLogin,
    userLogout,
} from './controller/user-controller.js';

const router = express.Router()

// Controller will contain all the User-defined Routes
router.get('/', (_, res) => res.send('Hello World from user-service'))
router.post('/login', userLogin)
router.post('/logout', userLogout)
router.post('/newacc', createUser)
router.post('/deleteacc', deleteUser)
router.post('/updateacc', changePassword)


app.use('/api/user', router).all((_, res) => {
    res.setHeader('content-type', 'application/json')
    res.setHeader('Access-Control-Allow-Origin', '*')
})

app.listen(process.env.PORT, () => console.log('user-service listening on port 8000'));