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
let colors = ['#47c2ff', '#ff7d56', '#ffd256', '#9f56ff', '#b3b3b3']

function checkUsersExists(userId) {
    if (!users.length) return false
    for (let i = 0; i < users.length; i++) {
        if (users[i] && users[i].userId == userId) {
            return true;
        }
    }
    return false;
}

function handleMessageCmd(msgData) {
    if (msgData && msgData.message.includes('/name')) {
        let newNameData = msgData.message.split(' ');
        if (newNameData.length !== 2) return false;
        if (!checkUsersExists(newNameData[1])) {
            for (let i = 0; i < users.length; i++) {
                if (users[i] && users[i].userId == msgData.userId) {
                    users[i].userName = newNameData[1];
                    return true;
                }
            }
        }
    }
    if (msgData && msgData.message.includes('/color')) {
        let newColorData = msgData.message.split(' ');
        if (newColorData.length !== 2) return false;
        for (let i = 0; i < users.length; i++) {
            if (users[i] && users[i].userId == msgData.userId) {
                users[i].color = newColorData[1];
                return true;
            }
        }
    }
    return false;
}

io.on('connection', (socket) => {
    socket.on('user connected', () => {
        if (socket.handshake.headers.cookie) {
            let cookie = socket.handshake.headers.cookie.split(';');
            let cookieUserId = '';
            let cookieUserName = '';
            let cookColorId = '';
            for (let i = 0; i < cookie.length; i++) {
                if (cookie[i].includes('userId')) {
                    cookieUserId = cookie[i].split('=')[1]
                }
                if (cookie[i].includes('userName')) {
                    cookieUserName = cookie[i].split('=')[1]
                }
                if (cookie[i].includes('userColorId')) {
                    cookColorId = cookie[i].split('=')[1]
                }
            }
            let user = {
                userId: cookieUserId,
                userName: cookieUserName,
                color: cookColorId,
            }
            if(!checkUsersExists(user.userId)) {
                users.push(user);
            } else {
                let userId = `User${Date.now()}`
                user = {
                    userId: userId,
                    userName: userId,
                    color: colors[users.length > 4 ? 4 : users.length],
                }
                users.push(user);
            }
            socket.emit('user connected', user);
        } else {
            let userId = `User${Date.now()}`
            let user = {
                userId: userId,
                userName: userId,
                color: colors[users.length > 4 ? 4 : users.length],
            }
            users.push(user);
            socket.emit('user connected', user);
        }
    })
    socket.on('active users', () => {
        io.emit('active users', users);
    })
    socket.on('active messages', () => {
        socket.emit('active messages', messages);
    })

    socket.on('chat message', (msgData) => {
        if (handleMessageCmd(msgData)) {
            io.emit('active users', users);
            return;
        };
        msgData.message = msgData.message.replace(':)', "😁").replace(':(', "🙁").replace(':o', "😲");
        let timeStamp = new Date(Date.now());
        msgData = {
            ...msgData,
            timeStamp,
            formatedTimeStamp: (timeStamp.getHours() > 12 ? (timeStamp.getHours()-12) : (timeStamp.getHours()))  + ':' + (timeStamp.getMinutes() < 10 ? ('0' + timeStamp.getMinutes()) : (timeStamp.getMinutes())) + (timeStamp.getHours() > 12 ? 'pm' : 'am'),
        };
        if (messages && messages.length > 200) {
            messages.shift();
        }
        messages.push(msgData);

        io.emit('chat message', msgData);
      });

    socket.on('disconnect', () => {
        if (socket.handshake.headers.cookie) {
            let cookie = socket.handshake.headers.cookie.split(';');
            let cookieUserId = '';
            for (let i = 0; i < cookie.length; i++) {
                if (cookie[i].includes('userId')) {
                    cookieUserId = cookie[i].split('=')[1]
                }
            }
            users = users.filter(user => user.userId !== cookieUserId);
        }
        io.emit('active users', users);
      });
  });

http.listen(3000, () => {
  console.log('listening on *:3000');
});