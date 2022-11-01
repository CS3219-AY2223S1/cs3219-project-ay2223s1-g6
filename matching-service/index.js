import cors from 'cors';
import express from 'express';
import { db } from './model/database.js';
import { Server } from 'socket.io';
import { createServer } from 'http';
import {
  handleJoinRoom,
  handleLeaveRoom,
  handleMatchDisconnect,
  handleNewMatch,
  handleRoomDisconnect,
} from './controller/match-controller.js';

const app = express();

import * as dotenv from 'dotenv';
import * as dotenvExpand from 'dotenv-expand'
dotenvExpand.expand(dotenv.config())
const PORT = process.env.MATCHING_SERVICE_PORT
const PREFIX = process.env.MATCHING_SERVICE_PREFIX
const ROOM_PREFIX = process.env.MATCHING_SERVICE_ROOM_PREFIX

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

io.of(PREFIX)
  .on('connection', (socket) => {
    console.log('a user connected to /api/match, socket id: ' + socket.id); // ojIckSD2jqNzOqIrAGzL

    socket.on('new match', (data) => {
      console.log('new match');
      // emitted when user clicks a button to start looking for a new match
      handleNewMatch(data, socket);
    });

    socket.on('disconnect', () => {
      // emitted when client calls socket.disconnect() at the end (after session ends and socket is no longer used)
      console.log('a user disconnected from /api/match, socket id: ' + socket.id);
      console.log(socket.rooms);  // empty set because socket has already left all rooms
      handleMatchDisconnect(socket);
    });
  });

io.of(ROOM_PREFIX)
  .on('connection', (socket) => {
    console.log('a user connected to /api/room, socket id: ' + socket.id); // ojIckSD2jqNzOqIrAGzL

    socket.on('join room', (data) => {
      // emitted when user enters the room (page) after matching
      console.log('Socket joining room: ' + socket.id);
      handleJoinRoom(data, socket);
    });

    socket.on('leave room', (data) => {
      // emitted when user clicks a button to end the session
      handleLeaveRoom(data, socket);
    });

    socket.on('disconnect', () => {
      // emitted when client calls socket.disconnect() at the end (after session ends and socket is no longer used)
      console.log('a user disconnected from /api/room, socket id: ' + socket.id);
      handleRoomDisconnect(socket);
    });
  });

server.listen(PORT, () => {
  console.log('Matching service server started on port ' + PORT);
});

export default io;  // TODO: export does not seem to be the best practice
