import * as redis from 'redis'
import * as dotenv from 'dotenv'

dotenv.config();
let uri = process.env.REDIS_ENV == "PROD"
    ? process.env.REDIS_CLOUD_URI
    : process.env.REDIS_LOCAL_URI

const client = redis.createClient({ url: uri})

client.on('error', (err) => console.log(`Redis Client Error: Connect ${uri}\n`, err))
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