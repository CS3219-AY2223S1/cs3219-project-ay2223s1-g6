import UserModel from './user-model.js'
import * as dotenv from "dotenv"
import * as mongoose from "mongoose"

dotenv.config()

let uri = process.env.MONGO_ENV == "PROD"
  ? process.env.MONGO_CLOUD_URI
  : process.env.MONGO_LOCAL_URI

try {
  mongoose.connect(
    uri,
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => { console.log("Mongodb connected."); },
  )
} catch (e) {
  console.error(e)
}


//const con = mongoose.connection
//con.on('error', (err) => console.log(`MongoDB connection Error: ${err}`))
//con.once("open", () => console.log("Connected to MongoDB"));

export async function createUser(params) {
  return new UserModel(params)
}

export async function findUserByUsername(params) {
  // let user = new UserModel()
  // UserModel.findOne({ username: params }).exec(function(err, u) {
  //   if (err) console.log(err)
  //   user = u
  // })
  // return user
  return UserModel.where('username').equals(params)
}

export async function deleteUserByUsername(params) {
  return UserModel.deleteOne({ username: params })
}

export async function updateUserByUsername(username, password) {
  return UserModel.updateOne({username:username}, {password:password})
}