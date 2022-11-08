import {
    ormCreateUser,
    ormDeleteUser,
    ormChangePassword,
    ormRetreivePassword,
} from '../model/user-orm.js'

import {
    generateToken,
    validateToken,
    deleteToken,
} from '../model/user-authentication.js'

import {
    encryptPassword,
    verifyPassword,
} from '../model/user-sec.js'


export async function createUser(username, password) {
    const encrypted = await encryptPassword(password)
    const status = await ormCreateUser(username, encrypted)
    if (status === false) {
        return {OK:false, token:''}
    }
    const token = await generateToken(username)
    return {OK:true, token:token}
}

export async function deleteUser(username, token) {
    const status = await validateToken(username, token)
    if (status === false) {
        return {OK:false, message:'Invalid token'}
    }

    await ormDeleteUser(username)

    if (await deleteToken(username) === 1) {
        return {OK:true, message:'Token deleted'}
    } else {
        return {OK:false, message:'Token delete failed.'}
    }
}

export async function changePassword(username, newPassword, token) {
    const status = await validateToken(username, token)
    if (status === false) {
        return {OK:false, message:'Invalid token'}
    }
    await ormChangePassword(username, await encryptPassword(newPassword))
    return {OK:true, message:'Password changed'}
}

export async function login(username, password) {
    const hashed = await ormRetreivePassword(username)
    console.log('password retreived')
    if (verifyPassword(password, hashed) === false) {
        return { OK:false, token:'' }
    }
    const token = await generateToken(username)
    return { OK:true, token:token }
}

export async function logout(username, token) {
    // TODO: Logout does not need to validate token, a user can log out even if he's not logged in
    const status = await validateToken(username, token)
    if (status === false) {
        return {OK:false, message:'Invalid token'}
    }

    if (await deleteToken(username) === 1) {
        return {OK:true, message:'Token deleted'}
    } else {
        return {OK:false, message:'Token delete failed.'}
    }
}

export async function authenticate(username, token) {
    return await validateToken(username, token)
}