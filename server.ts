import * as socketio from 'socket.io';
import * as path from 'path';
import { generateMessage, generateLocationMessage } from './utils/messages';

import { addUser, removeUser, getUser, getUsersInRoom } from './utils/users';

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
  socket.on('join', (options, callback) => {
    const { error, user } = addUser({ id: socket.id, ...options });

    if (error) {
      return callback(error);
    }

    socket.join(user.room);

    socket.emit('message', generateMessage('Admin', 'Welcome'));
    socket.broadcast
      .to(user.room)
      .emit(
        'message',
        generateMessage('Admin', `${user.username} has joined!`)
      );

    io.to(user.room).emit('roomData', {
      room: user.room,
      users: getUsersInRoom(user.room)
    });

    callback();
  });

  socket.on('sendMessage', (message: String, callback: Function) => {
    const user = getUser(socket.id);
    const filter = new badWords();
    if (filter.isProfane(message)) {
      return callback('Profanity is not allowed');
    }

    io.to(user.room).emit('message', generateMessage(user.username, message));
    callback();
  });

  socket.on('sendLocation', (coords, callback) => {
    const user = getUser(socket.id);

    io.to(user.room).emit(
      'locationMessage',
      generateLocationMessage({
        username: user.username,
        url: `https://google.com/maps?q=${coords.latitude},${coords.longitude}`
      })
    );
    callback();
  });

  socket.on('disconnect', () => {
    const user = removeUser(socket.id);

    if (user) {
      // @ts-ignore
      io.to(user.room).emit(
        'message',
        // @ts-ignore
        generateMessage(`${user.username} has left!`)
      );
      // @ts-ignore

      io.to(user.room).emit('roomData', {
        // @ts-ignore
        room: user.room,
        // @ts-ignore
        users: getUsersInRoom(user.room)
      });
    }
  });
});

server.listen(port, () => {
  console.log(`Server is up on port ${port}!`);
});
