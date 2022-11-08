import * as tokenDAO from '../dao/redis-repo.js'

import jwt from 'jsonwebtoken'
import * as dotenv from 'dotenv'
import * as dotenvExpand from 'dotenv-expand'
dotenvExpand.expand(dotenv.config())
const SECRET_KEY = process.env.USER_SERVICE_JWT_SECRET_KEY

const TTL = 20 * 60

export async function generateToken(key) {
    const token = jwt.sign(key, SECRET_KEY)
    tokenDAO.createEntry(key, token, TTL)
    return token
}

export async function validateToken(token) {
    jwt.verify(token, SECRET_KEY, (err, key) => {
        if (err) {
            throw err
        } else {
            tokenDAO.refreshEntry(key, TTL)
        }
    })
}

export async function deleteToken(token) {
    jwt.verify(token, SECRET_KEY, (err, key) => {
        if (err) {
            throw err
        } else {
            tokenDAO.deleteEntry(key)
        }
    })
}