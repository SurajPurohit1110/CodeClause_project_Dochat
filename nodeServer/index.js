// Node server which will handle socket in connections
const express = require("express");
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(8000, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

const users = {};

io.on('connection', socket => {
    // If any new user joins, let other users connected to the server know!
    socket.on('new-user-joined', name => {
        users[socket.id] = name;
        socket.broadcast.emit('user-joined', name);
        io.emit('user-list', users);
    });
    
    // If someone sends a message, broadcast it to other people
    socket.on('send', message => {
        socket.broadcast.emit('recieve', { message: message, name: users[socket.id] });
    });
    
    // If someone leaves the chat, let others know
    socket.on('disconnect', message => {
        socket.broadcast.emit('left', users[socket.id]);
        delete users[socket.id];
        io.emit('user-list', users);
    });
})
