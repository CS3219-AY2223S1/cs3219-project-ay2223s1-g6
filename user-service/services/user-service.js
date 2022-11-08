import * as userDAO from '../dao/mongo-repo.js'
import { encryptPassword, verifyPassword } from '../common/security.js'

export async function createUser(username, password) {
    const exist = await userDAO.findUserByUsername(username)
    if (exist) {
        return {
            success: false,
            message: 'Username already in use.'
        }
    }

    try {
        const encrypted = await encryptPassword(password)
        await userDAO.createUserByUsernameAndPassword(username, encrypted);
        return {
            success: true,
            message: 'User created successfully.',
        }
    } catch (err) {
        console.log(err)
        return {
            success: false,
            message: 'Server error. Could not create new user.'
        }
    }
}

export async function deleteUser(username) {
    try {
        await userDAO.deleteUserByUsername(username);
        return {
            success: true,
            message: 'User deleted successfully.',
        }
    } catch (err) {
        console.log(err)
        return {
            success: false,
            message: 'Server error. Could not delete user.'
        }
    }
}

export async function changePassword(username, newPassword) {
    try {
        const encrypted = await encryptPassword(newPassword)
        await userDAO.updateUserByUsernameAndPassword(username, encrypted);
        return {
            success: true,
            message: 'Password updated successfully.'
        }
    } catch (err) {
        console.log(err)
        return {
            success: false,
            message: 'Server error. Could not update user password.'
        }
    }
}

export async function login(username, password) {
    try {
        const exist = await userDAO.findUserByUsername(username)
        if (!exist) {
            return {
                success: false,
                message: 'User does not exist.'
            }
        }

        const hashed = await userDAO.findPasswordByUsername(username);
        if(hashed == null) {
            return {
                success: false,
                message: 'Could not find user.'
            }
        } else {
            if (verifyPassword(password, hashed)) {
                return {
                    success: true,
                    message: 'User login success.'
                }
            } else {
                return {
                    success: false,
                    message: 'Wrong password.'
                }
            }
        }
    } catch (err) {
        console.log(err)
        return {
            success: false,
            message: 'Server error. Could not find password.'
        }
    }
}
