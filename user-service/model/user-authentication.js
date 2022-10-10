import jwt from 'jsonwebtoken'
import * as dotenv from 'dotenv'
dotenv.config()

import {
    createEntry,
    refreshEntry,
    getEntry,
    deleteEntry,
} from './redis-repo.js'


const ttl = 20 * 60

export async function generateToken(username) {
    const jwtSecretKey = process.env.JWT_SECRET_KEY
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