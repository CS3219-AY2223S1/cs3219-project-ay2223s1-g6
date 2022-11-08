import User from '../models/user-model.js'

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

export async function createUserByUsernameAndPassword(username, password) {
  const newUser = new User({
    username: username,
    password: password,
  })
  newUser.save((err) => {
    if (err)
      throw err
  })
}

export async function findUserByUsername(username) {
  const user = await User.findOne({
    username: username,
  }).exec()
  return user != null
}

export async function findPasswordByUsername(username) {
  const user = await User.findOne({
    username: username,
  }).exec()
  if(user == null) {
    return null
  } else {
    return user.password
  }
}

export async function deleteUserByUsername(username) {
  await User.deleteOne({
    username: username
  }).exec()
}

export async function updateUserByUsernameAndPassword(username, password) {
  await User.updateOne({
    username: username
  }, {
    password: password
  }).exec()
}