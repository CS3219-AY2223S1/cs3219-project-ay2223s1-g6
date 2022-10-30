import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { handleEditorChange, handleJoinRoom } from './controller/editor-controller.js';

const app = express();
const port = process.env.PORT || 8003;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors()); // config cors so that front-end can use
app.options('*', cors());

const server = createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

io.of('/api/editor')
  .on('connection', (socket) => {
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

server.listen(port, () => {
  console.log('Editor service server started on port ' + port);
});

export default io;
