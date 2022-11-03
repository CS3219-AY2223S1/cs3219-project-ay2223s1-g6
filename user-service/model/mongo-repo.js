import UserModel from './user-model.js'
import * as mongoose from "mongoose"
import * as dotenv from 'dotenv'
import * as dotenvExpand from 'dotenv-expand'
dotenvExpand.expand(dotenv.config())

const MONGO_URI = process.env.USER_SERVICE_MONGO_ENV == "DEV"
    ? process.env.USER_SERVICE_MONGO_URI_LOCAL
    : process.env.USER_SERVICE_MONGO_URI_CLOUD


try {
  mongoose.connect(
    MONGO_URI,
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => { console.log("Mongodb connected."); },
  )
} catch (e) {
  console.error(e)
}

export async function createUser(params) {
  return new UserModel(params)
}

export async function findUserByUsername(params) {
  return UserModel.where('username').equals(params)
}

export async function deleteUserByUsername(params) {
  return UserModel.deleteOne({ username: params })
}

export async function updateUserByUsername(username, password) {
  return UserModel.updateOne({username:username}, {password:password})
}