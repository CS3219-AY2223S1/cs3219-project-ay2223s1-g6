import {
    createUser,
    findUserByUsername,
    deleteUserByUsername,
    updateUserByUsername,
} from './mongo-repo.js';


//need to separate orm functions from repository to decouple business logic from persistence
export async function ormCreateUser(username, password) {
    const ctr = await findUserByUsername(username)
    if (ctr.length) {
        return false
    }
    try {
        const newUser = await createUser({ username, password });
        newUser.save();
        return true;
    } catch (err) {
        console.log('ERROR: orm Could not create new user');
        return { err };
    }
}


export async function ormDeleteUser(username) {
    try {
        console.log('trying to delete user')
        await deleteUserByUsername(username);
        return true;
    } catch (err) {
        console.log('ERROR: Could not delete user');
        return { err };
    }
}


export async function ormChangePassword(username, newPassword) {
    try {
        await updateUserByUsername(username, newPassword);
        return true;
    } catch (err) {
        console.log('ERROR: Could not update user password');
        console.log(err)
        return { err };
    }
}

export async function ormRetreivePassword(username) {
    try {
        const user = await findUserByUsername(username);
        return user[0].password;
    } catch (err) {
        console.log('ERROR: Could not find password');
        return { err };
    }
}