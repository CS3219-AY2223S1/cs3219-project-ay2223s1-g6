import {
    createUser as _createUser,
    deleteUser as _deleteUser,
    changePassword as _changePassword,
    login as _userLogin,
    logout as _userLogout,
} from '../service/user-service.js'

export async function createUser(req, res) {
    try {
        const { username, password } = req.body;
        if (username && password) {
            const resp = await _createUser(username, password);
            if (resp.OK) {
                console.log(`Created new user successfully! Username: ${username}`)
                console.log(`Cached token: ${resp.token}`)
                res.cookie('auth', resp.token)
                //return res.redirect('/api/matching')
                return res.status(201).json({ message: `Created new user ${username} successfully!`});
                
            } else {
                return res.status(409).json({ message: 'Username already in use.' });
            }
        } else {
            return res.status(400).json({ message: 'Username and/or Password are missing!' });
        }
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: 'Database failure when creating new user!' })
    }
}

export async function deleteUser(req, res) {
    try {
        const username = req.body.username;
        if (username) {
            const token = req.cookies.auth
            console.log('Received token:', token)
            const resp = await _deleteUser(username, token);
            if (resp.OK) {
                console.log(`User ${username} deleted successfully!`);
                // return res.redirect('/login')
                return res.status(201).json({ message: `User ${username} successfully deleted!` });
            } else {
                return res.status(400).json({ message: `Could not delete user ${username}!` });
            }
        } else {
            console.log('Username missing for user delete.');
            return;
        }

    } catch (err) {
        return res.status(500).json({ message: `Database failure when deleting user!` });
    }
}

export async function changePassword(req, res) {
    try {
        const { username, password } = req.body;
        if (username && password) {
            const token = req.cookies.auth
            console.log('Received token:', token)
            const resp = await _changePassword(username, password, token)
            if (resp.OK) {
                console.log(`User ${username} changed password successfully!`)
                return res.status(201).json({ message: `User ${username} changed password successfully!` });
            } else {
                return res.status(400).json({ message: `Could change password for user ${username}!` });
            }
        } else {
            console.log('Username and/or new password missing.');
            return;
        }
    } catch (err) {
        return res.status(500).json({ message: `Database failure when changing password!` });
    }
}


export async function userLogin(req, res) {
    try {
        const { username, password } = req.body;
        if (username && password) {
            const resp = await _userLogin(username, password);
            if (resp.OK) {
                console.log(`User ${username} changed password successfully!`);
                console.log(`Cached token: ${resp.token}`)
                res.cookie('auth', resp.token)
                //return res.redirect('/api/matching')
                return res.status(201).json({ message: `User ${username} logged in successfully!` });
            } else {
                return res.status(400).json({ message: `Login failed for user ${username}!` });
            }
        } else {
            console.log('Username and/or new password missing.');
            return;
        }
    } catch (err) {
        return res.status(500).json({ message: `Failed to login!` });
    }
}

export async function userLogout(req, res) {
    try {
        const username = req.body.username;

        if (username) {
            const token = req.cookies.auth
            console.log('Received token:', token)
            const resp = await _userLogout(username, token);
            if (resp.OK) {
                console.log(`User ${username} logged out successfully!`);
                // return res.redirect('/login')
                return res.status(201).json({ message: `User ${username} logged out successfully!` });
            } else {
                return res.status(400).json({ message: `Invalid token for user ${username}!` });
            }
        } else {
            console.log('Username missing.');
            return;
        }

    } catch (err) {
        return res.status(500).json({ message: `Database error, Failed to logout!` });
    }
}