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

function checkUsersExists(user) {
    if (!users.length) return false
    for (i = 0; i < users.length; i++) {
        if (users[i] && users[i].userId == user.userId) {
            return true;
        }
    }
    return false;
}

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('user connected', () => {
        if (socket.handshake.headers.cookie) {
            let cookieData = {
                userId: socket.handshake.headers.cookie.split(';')[0].split('=')[1],
                userColorId: socket.handshake.headers.cookie.split(';')[1].split('=')[1],
            }
            console.log(cookieData)
            let user = {
                userId: cookieData.userId,
                color: cookieData.userColorId,
            }
            if(!checkUsersExists(user)) users.push(user);
            socket.emit('user connected', user);
        } else {
            let user = {
                userId: `User${Date.now()}`,
                color: colors[users.length > 4 ? 4 : users.length],
            }
            users.push(user);
            socket.emit('user connected', user);
        }
    })
    socket.on('active users', () => {
        console.log('on active users')
        socket.emit('active users', users);
    })
    socket.on('active messages', () => {
        console.log('on active messages')
        socket.emit('active messages', messages);
    })

    socket.on('chat message', (msgData) => {
        console.log('on chat message')
        let timeStamp = new Date(Date.now());
        msgData = {
            ...msgData,
            timeStamp,
            formatedTimeStamp: (timeStamp.getHours() > 12 ? (timeStamp.getHours()-12) : (timeStamp.getHours()))  + ':' + (timeStamp.getMinutes() < 10 ? ('0' + timeStamp.getMinutes()) : (timeStamp.getMinutes())) + (timeStamp.getHours() > 12 ? 'pm' : 'am'),
        };
        messages.push(msgData);
        console.log(messages)
        io.emit('chat message', msgData);
        // socket.broadcast.emit('chat message', msgData);
      });

    socket.on('disconnect', () => {
        console.log('user disconnected');
      });
  });

http.listen(3000, () => {
  console.log('listening on *:3000');
});