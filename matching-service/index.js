import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { handleJoinRoom, handleLeaveRoom, handleNewMatch } from './controller/match-controller.js';
import { db } from './model/database.js';

const app = express();
const port = process.env.PORT || 8001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors()); // config cors so that front-end can use
app.options('*', cors()); // TODO: what's this?

// TODO: Add GET endpoint for room /api/match/room return roomId (and difficultyLevel)

await db.sync().then(() => {
  console.log('Connected to DB');
}).catch((error) => {
  console.log('Failed to connect to DB');
  console.log(error);
});

const server = createServer(app);
const io = new Server(server, { cors: { origin: '*' } });  // TODO: export does not seem to be the best practice

io.of('/api/match')
  .on('connection', (socket) => {
    console.log('a user connected, socket id: ' + socket.id); // ojIckSD2jqNzOqIrAGzL

    socket.on('new match', (data) => {
      // emitted when user clicks a button to start looking for a new match
      handleNewMatch(data, socket);
    });

    socket.on('join room', (data) => {
      // emitted when user enters the room (page) after matching
      handleJoinRoom(data, socket);
    });

    socket.on('leave room', (data) => {
      // emitted when user clicks a button to end the session
      handleLeaveRoom(data, socket);
    });

    socket.on('disconnect', () => {
      // emitted when client calls socket.disconnect() at the end (after session ends and socket is no longer used)
      console.log('a user disconnected, socket id: ' + socket.id);
      // TODO: handle disconnect (This may be a rare case)
    });
  });

server.listen(port, () => {
  console.log('Matching service server started on port ' + port);
});

export default io;  // TODO: export does not seem to be the best practice
