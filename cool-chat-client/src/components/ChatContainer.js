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
                console.log('emitting active users')
                socket.emit('active users');
            }
            if (!messages.length) {
                console.log('emitting active messages')
                socket.emit('active messages');
            }
            setIntialHandshakeComplete(true)
        } else {
            console.log('initial handshake done')
            socket.on('user connected', handleUserConnected);
            socket.on('active users', handleActiveUsers);
            socket.on('active messages', handleActiveMessages)
            socket.on('chat message', recieveMessage);
        }
      }, [socket, setSocket, intialHandshake, setIntialHandshakeComplete, users, user]);

    const handleUserConnected = (userId) => {
        if (!user || !Cookies.get('userId')) {
            setUser(userId);
            Cookies.set('userId', userId.userId, {expires: 7});
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

    const sendMessage = (message) => {
        const msgData = {
            message,
            userId: user.userId,
        }
        socket.emit('chat message', msgData);
    }

    const recieveMessage = (message) => {
        if (messages.length > 0 && message === messages[messages.length - 1]){
            return
        }
        setMessages([...messages, message]);
        messages.push(message)
    }

    const handleSnackBarClose = () => {
        setOpenSnackbar(false);
    }

    return (
        <div className="chat-container-content">
        <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={handleSnackBarClose} message={`Welcome ${user && user.userId}!`} anchorOrigin={{vertical: 'top', horizontal: 'center',
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
    