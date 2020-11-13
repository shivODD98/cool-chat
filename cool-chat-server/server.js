const express = require('express');
var app = require('express')();
var http = require('http').createServer(app);
const path = require('path');
var io = require('socket.io')(http);

app.use(express.static(path.join(__dirname, "../cool-chat-client/build")));
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "../cool-chat-client/build/index.html"));
})

let messages = [];
let users = [];
// let user = {};

let colors = ['#47c2ff', '#ff7d56', '#ffd256', '#9f56ff', '#b3b3b3']

io.on('connection', (socket) => {
    console.log('a user connected');
        
    let user = {
        userId: `User${users.length}`,
        color: colors[users.length > 4 ? 4 : users.length],
    } 
    
    users.push(user);
    console.log(user)
    console.log(users)

    io.emit('user connected', user);
    io.emit('active users', users);
    // io.emit('active messages', messages);
    console.log(messages)

    socket.on('chat message', (msgData) => {
        let timeStamp = new Date(Date.now());
        msgData = {
            ...msgData,
            timeStamp,
            formatedTimeStamp: (timeStamp.getHours() > 12 ? (timeStamp.getHours()-12) : (timeStamp.getHours()))  + ':' + timeStamp.getMinutes(),
        };
        messages.push(msgData);
        io.emit('chat message', msgData);
      });

    socket.on('disconnect', () => {
        console.log('user disconnected');
      });
  });

http.listen(3000, () => {
  console.log('listening on *:3000');
});