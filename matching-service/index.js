import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { createPendingMatch } from './controller/match-controller.js';
import { db } from './model/database.js';

const app = express();
const port = process.env.PORT || 8001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors()); // config cors so that front-end can use
app.options('*', cors()); // TODO: what's this?

app.post('/api/match', createPendingMatch);

// TODO: add try-catch blocks

await db.sync().then(() => {
  console.log('Connected to DB');
}).catch((error) => {
  console.log('Failed to connect to DB');
  console.log(error);
});

const server = app.listen(port, () => {
  console.log('Matching service server started on port ' + port);
}); // TODO: socketio.listen(server) or else
