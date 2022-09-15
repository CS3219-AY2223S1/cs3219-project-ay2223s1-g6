import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import db from './model/repository.js';

// const db = import('./model/repository.js');
// const db = require('./model/repository.js')
const app = express();
const port = process.env.PORT || 8001;
import questionDifficulty from './model/repository.js'

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors()); // config cors so that front-end can use
app.options('*', cors()); // TODO: what's this?

app.get('/api/matching', (req, res) => {
  res.status(200).send('Hello World from matching-service');
});

app.get('/api/matching/addUser', (req, res) => {
  res.status(200).send('Hello World from add user');
  const newUser = db.questionDifficulty.create({
    id: 2,
    difficultyLevel: "easy"
  });
  // console.log("created user");
  // const allUsers = db.questionDifficulty.findAll();
  // console.log("All users:", JSON.stringify(allUsers, null, 2));
  // res.status(200).send('Create User');
});

try {
  db.connection();
} catch (error) {
  console.log(error);
}

console.log('Calling app.listen()');

const server = app.listen(port, () => {
  console.log('Matching service server started on port ' + port);
}); // TODO: socketio.listen(server)

console.log('app.listen() executed');
