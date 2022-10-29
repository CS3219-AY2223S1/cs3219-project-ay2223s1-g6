import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { handleJoinRoom, handleNewMessage } from './controller/chat-controller.js';

const app = express();
const port = process.env.PORT || 8004;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors()); // config cors so that front-end can use
app.options('*', cors());

const server = createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

io.of('/api/chat')
  .on('connection', (socket) => {
    console.log('a user connected, socket id: ' + socket.id); // ojIckSD2jqNzOqIrAGzL

    socket.on('join room', (data) => {
      // emitted when user enters the room (page) after matching
      handleJoinRoom(data, socket);
    });

    socket.on('message', (data) => {
      // emitted when either user sends a new message
      handleNewMessage(data, socket);
    });

    socket.on('disconnect', () => {
      // nothing to handle
    });
  });

server.listen(port, () => {
  console.log('Chat service server started on port ' + port);
});

export default io;
