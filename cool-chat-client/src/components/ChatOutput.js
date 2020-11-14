import React,  {Fragment, useEffect, useState, useRef }from 'react';
import '../styles/App.css';
import { 
    Typography , 
} from '@material-ui/core';

function ChatOutput(props) {
    const endOfChatOutput = useRef();
    const {
        messages,
        user,
        users,
    } = props;

    useEffect(() => {
        scrollToBottom();
      }, [messages]);

    const scrollToBottom = () => {
        endOfChatOutput.current.scrollIntoView({ behavior: 'smooth' })
    }

    const renderMessageitem = (message) => {
        if (message.userId === user.userId) {
            let usersColor = '';
            let userName = '';
            for (let i = 0; i < users.length; i++) {
                if (users[i] && users[i].userId === message.userId) {
                    usersColor = users[i].color;
                }
            }
            return (
                <div className="message-bubble-right">
                    <div className="message-filler-left"><Typography variant="caption" color="textSecondary">{message.formatedTimeStamp}</Typography></div>
                    <div className="message-content-right" style={{backgroundColor: usersColor}}>{message.message}</div>
                </div>
            )
        }
        let usersColor = '';
        let userName = '';
        for (let i = 0; i < users.length; i++) {
            if (users[i] && users[i].userId === message.userId) {
                usersColor = users[i].color;
                userName = users[i].userName;
            }
        }
        return (
            <div className="message-bubble-left">
                <div className="message-content-left">
                    <div className="message-content-username"><Typography variant="caption" color="textSecondary">{`${userName} ${message.formatedTimeStamp}`}</Typography></div>
                    <br/>
                    <div className="message-content-message" style={{backgroundColor: usersColor}}>{message.message}</div>
                </div>
                <div className="message-filler-right"></div>
            </div>
        )
    }

    const renderMessages = () => {
        if ( messages && messages.length > 0) {
            const messageBubbles = []
            for (let i = 0; i < messages.length; i = i +1) {
                messageBubbles.push(renderMessageitem(messages[i]));
            }
            return messageBubbles;
        } else {
            return (
                <div>
                    No messages yet :( Send a chat to get the convo going!
                </div>
            )
        }
    }

    return (
        <div className="chat-output-field">
            {renderMessages()}
            <div ref={endOfChatOutput} />
        </div>
      );
    }
    
export default ChatOutput;
    