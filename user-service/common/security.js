import * as bcrypt from 'bcrypt'

const saltRounds = 10;

export async function encryptPassword(plain) {
    return bcrypt.hashSync(plain, saltRounds)
}

export function verifyPassword(plain, hashed) {
    return bcrypt.compareSync(plain, hashed)
}