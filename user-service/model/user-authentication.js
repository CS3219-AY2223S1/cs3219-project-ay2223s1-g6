import jwt from 'jsonwebtoken'
import * as dotenv from 'dotenv'
import * as dotenvExpand from 'dotenv-expand'
dotenvExpand.expand(dotenv.config())
const jwtSecretKey = process.env.USER_SERVICE_JWT_SECRET_KEY

import {
    createEntry,
    refreshEntry,
    getEntry,
    deleteEntry,
} from './redis-repo.js'


const ttl = 20 * 60

export async function generateToken(username) {
    const token = jwt.sign(username, jwtSecretKey)
    await createEntry(username, token, ttl)
    return token
}

export async function validateToken(username, token) {
    if (token === null || token === undefined) {
        return false
    }
    const entry = await getEntry(username)
    if (entry === null || token.localeCompare(entry)) {
        return false
    }
    try{await refreshEntry(username, ttl)}catch(err){console.log(err)}
    return true
}

export async function deleteToken(username) {
    return await deleteEntry(username)
}