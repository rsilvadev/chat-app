const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*'
  }
});

const { 
  getUser, 
  addUser, 
  removeUser,  
  updateUserTyping, 
  getUsersInRoom 
} = require('./users');
  
app.get('/', (req, res) => {
  res.send({response: 'server running'}).status(200);
});

io.on('connect', socket => {
  socket.on('join', ({ name, room }) => {
    addUser({ id: socket.id, isTyping: false, name, room });

    socket.join(room);

    console.log(`user ${name} connected to room ${room}`);

    socket.emit('message', { user: 'admin', text: `Welcome to the room ${name}` });
    
    socket.broadcast.to(room).emit('message', { user: 'admin', text: `${name} has joined` });

    io.to(room).emit('getRoomData', { users: getUsersInRoom(room) });
  });

  socket.on('sendMessage', ({ message, room }) => {
    const user = getUser(socket.id);

    if(user) {
      io.to(room).emit('message', { user: user.name, text: message });
    }
  });

  socket.on('userTyping', ({ room, isTyping }) => {
    updateUserTyping(socket.id, isTyping);

    io.to(room).emit('getRoomData', { users: getUsersInRoom(room) });
  });

  socket.on('disconnect', () => {
    const user = removeUser(socket.id);

    if(user) {
      io.to(user.room).emit('message', { user: 'admin', text: `${user.name} has left` });
      io.to(user.room).emit('getRoomData', { users: getUsersInRoom(user.room) });

      console.log(`user ${user.name} disconnected from room ${user.room}`);
    }
  });
});

server.listen(8000, () => {
  console.log('listening on port 8000');
});
