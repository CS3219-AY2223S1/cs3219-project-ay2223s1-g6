import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import db from './model/repository.js';

// const db = import('./model/repository.js');

const app = express();
const port = process.env.PORT || 8001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors()); // config cors so that front-end can use
app.options('*', cors()); // TODO: what's this?

app.get('/api/matching', (req, res) => {
  res.status(200).send('Hello World from matching-service');
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
