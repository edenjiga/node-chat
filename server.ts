import * as socketio from 'socket.io';
import * as path from 'path';
import { generateMessage, generateLocationMessage } from './utils/messages';

// @ts-ignore
import badWords from 'bad-words';

const express = require('express');

// Create the Express application
const app = express();

// Create the HTTP server using the Express app
const server = require('http').Server(app);
// Connect socket.io to the HTTP server
const io = require('socket.io')(server);

const port = process.env.PORT || 3000;
const publicDirectoryPath = path.join(__dirname, './public');

app.use(express.static(publicDirectoryPath));
// Listen for new connections to Socket.io
io.on('connection', (socket: socketio.Socket) => {
  socket.emit('message', generateMessage('Welcome'));

  socket.on('sendMessage', (message: String, callback: Function) => {
    const filter = new badWords();
    if (filter.isProfane(message)) {
      return callback('Profanity is not allowed');
    }

    io.emit('message', generateMessage(message));
    callback();
  });

  socket.on('sendLocation', (coords, callback) => {
    console.log('a');
    io.emit(
      'locationMessage',
      generateLocationMessage(
        `https://google.com/maps?q=${coords.latitude},${coords.longitude}`
      )
    );
    callback();
  });
});

server.listen(port, () => {
  console.log(`Server is up on port ${port}!`);
});
