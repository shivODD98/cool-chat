import React,  {Fragment, useEffect, useState }from 'react';
import '../styles/App.css';
import io from 'socket.io-client';
import Cookies from 'js-cookie';
import ChatInput from './ChatInput';
import ChatOutput from './ChatOutput';
import UsersList from './UsersList';
import { 
    Paper,
    Snackbar,
} from '@material-ui/core';

function ChatContainer(props) {
    const [socket, setSocket] = useState();
    const [messages, setMessages] = useState([]);
    const [user, setUser] = useState();
    const [users, setUsers] = useState([]);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [intialHandshake, setIntialHandshakeComplete] = useState(false);

    useEffect(() => {
        if (!socket) {
            setSocket(io());
        } else if (!intialHandshake) {
            if (!user) {
                socket.emit('user connected');
            }
            if (!users.length) {
                socket.emit('active users');
            }
            if (!messages.length) {
                socket.emit('active messages');
            }
            setIntialHandshakeComplete(true)
        } else {
            socket.on('user connected', handleUserConnected);
            socket.on('active users', handleActiveUsers);
            socket.on('active messages', handleActiveMessages)
            socket.on('chat message', recieveMessage);
        }
      }, [socket, setSocket, intialHandshake, setIntialHandshakeComplete, user]);

    const handleUserConnected = (userId) => {
        if (!user || !Cookies.get('userId')) {
            setUser(userId);
            Cookies.set('userId', userId.userId, {expires: 7});
            Cookies.set('userName', userId.userName, {expires: 7});
            Cookies.set('userColorId', userId.color, {expires: 7});
            setOpenSnackbar(true);
        }
    }

    const handleActiveUsers = (activeUsers) => {
        setUsers(activeUsers);
    }

    const handleActiveMessages = (activeMessages) => {
        setMessages(activeMessages);
    }

    const  checkUsersExists = (userId) => {
        if (!users.length) return false
        for (let i = 0; i < users.length; i++) {
            if (users[i] && users[i].userId == userId) {
                return true;
            }
        }
        return false;
    }

    const handleMessageCmd = (message) => {
        if (message.includes('/name')) {
            let newNameData = message.split(' ');
            if (!checkUsersExists(newNameData[1]) && newNameData.length == 2) {
                Cookies.set('userName', newNameData[1], {expires: 7});
            }
        }
        if (message.includes('/color')) {
            let newColorData = message.split(' ');
            if (newColorData.length !== 2) return false;
            Cookies.set('userColorId', newColorData[1], {expires: 7});
        }
        return false;
    }
    

    const sendMessage = (message) => {
        handleMessageCmd(message)
        const msgData = {
            message,
            userId: user.userId,
        }
        socket.emit('chat message', msgData);
        setMessages([...messages, msgData]);
        messages.push(msgData)
    }

    const recieveMessage = (message) => {
        if (messages.length > 0 && message === messages[messages.length - 1]){
            return
        }
        if (messages.length === 0) {socket.emit('active messages');}
        setMessages([...messages, message]);
        messages.push(message)
    }

    const handleSnackBarClose = () => {
        setOpenSnackbar(false);
    }

    return (
        <div className="chat-container-content">
        <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={handleSnackBarClose} message={`Welcome ${user && user.userName}!`} anchorOrigin={{vertical: 'top', horizontal: 'center',
        }}/>
            <div className="left-content-container">
                <Paper className="chat-content">
                    <div className="chat-output-container">
                        <ChatOutput
                            user={user}
                            users={users}
                            messages={messages}
                        />
                    </div>
                    <div className="chat-input-container">
                        <ChatInput
                            sendMessage={sendMessage}
                        />
                    </div>
                </Paper>
            </div>
            <div className="right-content-container">
                <Paper className="users-list">
                    <UsersList
                        user={user}
                        users={users}
                    />
                </Paper>
            </div>
        </div>
      );
    }
    
export default ChatContainer;
    