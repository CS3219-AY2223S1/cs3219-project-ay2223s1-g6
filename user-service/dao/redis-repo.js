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

export function createEntry(key, val, ttl) {
    client.multi().set(key, val).expire(key, ttl).exec()
}

export function refreshEntry(key, ttl) {
    client.expire(key, ttl)
}

export function deleteEntry(key) {
    client.del(key)
}