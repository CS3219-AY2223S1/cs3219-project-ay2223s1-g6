import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { db } from './model/database.js';
import { Server } from 'socket.io';

import { createServer } from 'http';
import { handleNewMatch } from './controller/match-controller.js';

const app = express();
const port = process.env.PORT || 8001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors()); // config cors so that front-end can use
app.options('*', cors()); // TODO: what's this?

await db.sync().then(() => {
  console.log('Connected to DB');
}).catch((error) => {
  console.log('Failed to connect to DB');
  console.log(error);
});

const server = createServer(app);
const io = new Server(server);  // TODO: export does not seem to be the best practice

io.of('/api/match')
  .on('connection', (socket) => {
    console.log('a user connected, socket id: ' + socket.id); // ojIckSD2jqNzOqIrAGzL

    socket.on('new match', (data) => {
      handleNewMatch(data, socket);
    });

    // TODO: handle leave room

    // TODO: handle disconnection
  });

server.listen(port, () => {
  console.log('Matching service server started on port ' + port);
});

export default io;
