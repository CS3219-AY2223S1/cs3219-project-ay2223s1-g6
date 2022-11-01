import * as redis from 'redis'
import * as dotenv from 'dotenv'
import * as dotenvExpand from 'dotenv-expand'
dotenvExpand.expand(dotenv.config())

const REDIS_URI = process.env.USER_SERVICE_REDIS_ENV == "DEV"
    ? process.env.USER_SERVICE_REDIS_URI_LOCAL
    : process.env.USER_SERVICE_REDIS_URI_CLOUD

const client = redis.createClient({ url: REDIS_URI })

client.on('error', (err) => console.log(`Redis Client Error: Connect ${REDIS_URI}\n`, err))
client.on('connect', (stream) => console.log('Redis connected.'))

await client.connect()

export async function createEntry(key, val, ttl) {
    console.log('creating entry in redis')
    return await client.multi().set(key, val).expire(key, ttl).exec()
}

export async function getEntry(key) {
    return await client.get(key)
}

export async function refreshEntry(key, ttl) {
    return await client.expire(key, ttl)
}

export async function deleteEntry(key) {
    return await client.del(key)
}