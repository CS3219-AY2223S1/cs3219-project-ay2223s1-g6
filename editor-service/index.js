import cors from 'cors';
import * as dotenv from 'dotenv';
import * as dotenvExpand from 'dotenv-expand';
import 'dotenv/config';
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { handleEditorChange, handleJoinRoom } from './controller/editor-controller.js';

dotenvExpand.expand(dotenv.config());
const PORT = process.env.EDITOR_SERVICE_PORT;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors()); // config cors so that front-end can use
app.options('*', cors());

const server = createServer(app);
const io = new Server(server, {
  cors: { origin: '*' },
  path: process.env.EDITOR_SERVICE_SOCKETIO_PATH,
});

io.on('connection', (socket) => {
  console.log('a user connected, socket id: ' + socket.id); // ojIckSD2jqNzOqIrAGzL

  socket.on('join room', (data) => {
    // emitted when user enters the room (page) after matching
    handleJoinRoom(data, socket);
  });

  socket.on('change', (data) => {
    // emitted when either user sends a new change
    handleEditorChange(data, socket);
  });

  socket.on('disconnect', () => {
    // nothing to handle
    console.log('a user disconnected, socket id: ' + socket.id);
  });
});

server.listen(PORT, () => {
  console.log('Editor service server started on port ' + PORT);
});

export default io;
