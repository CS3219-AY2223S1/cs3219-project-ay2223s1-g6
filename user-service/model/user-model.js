import * as mongoose from 'mongoose'

const UserModelSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        immutable: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    }
})

export default mongoose.model('UserModel', UserModelSchema)