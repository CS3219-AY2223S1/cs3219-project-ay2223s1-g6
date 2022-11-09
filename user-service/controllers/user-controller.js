import * as userService from '../services/user-service.js'

export async function createUser(req, res, next) {
    try {
        const username = req.body.username
        const password = req.body.password
        if (username && password) {
            const result = await userService.createUser(username, password);
            if (result.success) {
                console.log(`Created new user successfully! Username: ${username}`)
                req.authPayload = username
                next()
            } else {
                res.status(409).json({ 
                    status: 'error',
                    message: result.message,
                });
            }
        } else {
            res.status(400).json({
                status: 'error',
                message: 'Username and/or Password are missing!',
            });
        }
    } catch (err) {
        console.log('Create user failed due to server error.')
        console.log(err)
        res.status(500).json({
            status: 'error',
            message: 'Database failure when creating new user!',
        });
    }
}

export async function deleteUser(req, res) {
    try {
        const username = req.body.username;
        if (username) {
            const result = await userService.deleteUser(username);
            if (result.success) {
                console.log(`User ${username} deleted successfully!`);
                res.status(201).json({ 
                    status: 'success',
                    message: result.message,
                });
            } else {
                res.status(409).json({ 
                    status: 'error',
                    message: result.message,
                });
            }
        } else {
            res.status(400).json({
                status: 'error',
                message: 'Username and/or Password are missing!',
            });
        }
    } catch (err) {
        console.log('Delete user failed due to server error.')
        console.log(err)
        res.status(500).json({
            status: 'error',
            message: 'Database failure when deleting user!',
        });
    }
}

export async function changePassword(req, res) {
    try {
        const username = req.body.username
        const password = req.body.password
        if (username && password) {
            const result = await userService.changePassword(username, password)
            if (result.success) {
                res.status(201).json({ 
                    status: 'success',
                    message: result.message,
                });
            } else {
                res.status(409).json({ 
                    status: 'error',
                    message: result.message,
                });
            }
        } else {
            res.status(400).json({
                status: 'error',
                message: 'Username and/or Password are missing!',
            });
        }
    } catch (err) {
        console.log('Update password failed due to server error.')
        console.log(err)
        res.status(500).json({
            status: 'error',
            message: 'Database failure when updating password!',
        });
    }
}


export async function userLogin(req, res, next) {
    try {
        const username = req.body.username
        const password = req.body.password
        if (username && password) {
            const result = await userService.login(username, password);
            if (result.success) {
                console.log(`User ${username} login successful.`)
                req.authPayload = username
                next()
            } else {
                res.status(401).json({
                    status: 'error',
                    message: result.message,
                });
            }
        } else {
            res.status(400).json({
                status: 'error',
                message: 'Username and/or Password are missing!',
            });
        }
    } catch (err) {
        console.log('Login failed due to server error.')
        console.log(err)
        res.status(500).json({
            status: 'error',
            message: 'Database failure when logging in!',
        });
    }
}
