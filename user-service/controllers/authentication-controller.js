import * as authService from '../services/authentication-service.js'

export async function create(req, res) {
    try {
        const payload = req.authPayload
        if (payload) {
            console.log(`Creating token with payload: ${payload}`)
            const token = await authService.generateToken(payload)
            res.cookie('auth', token)
            res.status(201).json({
                status: 'success',
                message: 'Auth entry created.'
            });
        } else {
            res.status(500).json({
                status: 'error',
                message: 'Server error. Missing payload!'
            });
        }
    } catch (err) {
        console.log('Login failed due to server error.')
        console.log(err)
        res.status(500).json({
            status: 'error',
            message: `Server error. Failed to authenticate!`
        });
    }
}

export async function verify(req, res, next) {
    try {
        const token = req.cookies.auth
        if (token) {
            console.log(`Authenticating with: ${token}`)
            try {
                await authService.validateToken(token)
                next()
            } catch (err) {
                console.log(err)
                return res.status(400).json({ 
                    status: 'error',
                    message: `Failed to authenticate user!`,
                });
            }
        } else {
            res.status(401).json({
                status: 'error',
                message: 'Unauthorized. Please log in!'
            })
        }
    } catch (err) {
        console.log('Login failed due to server error.')
        console.log(err)
        res.status(500).json({
            status: 'error',
            message: `Server error. Failed to authenticate!`
        });
    }
}

export async function destroy(req, res) {
    try {
        const token = req.cookies.auth
        if (token) {
            console.log(`Destroying token: ${token}`)
            await authService.deleteToken(token)
            res.status(201).json({
                status: 'success',
                message: 'Token invalidation success.',
            })
        } else {
            res.status(401).json({
                status: 'error',
                message: 'Missing token.'
            });
        }
    } catch (err) {
        console.log('Login failed due to server error.')
        console.log(err)
        res.status(500).json({
            status: 'error',
            message: `Server error. Failed to destroy token!`
        });
    }
}

export async function standalone(req, res) {
    try {
        const token = req.query.auth
        if (token) {
            console.log(`Authenticating with: ${token}`)
            try {
                await authService.validateToken(token)
                return res.status(201).json({ 
                    status: 'success',
                    message: `User successfully authenticated!`,
                });
            } catch (err) {
                return res.status(400).json({ 
                    status: 'error',
                    message: `Failed to authenticate user!`,
                });
            }
        } else {
            res.status(400).json({
                status: 'error',
                message: 'Token missing.'
            })
        }
    } catch (err) {
        console.log('Login failed due to server error.')
        console.log(err)
        res.status(500).json({
            status: 'error',
            message: `Server error. Failed to authenticate!`
        });
    }
}