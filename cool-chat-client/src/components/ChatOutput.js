import React,  {Fragment, useEffect, useState }from 'react';
import '../styles/App.css';
import { 
    Typography , 
} from '@material-ui/core';

function ChatOutput(props) {
    const {
        messages,
        user,
    } = props;

    const renderMessageitem = (message) => {
        if (message.userId === user.userId) {
            return (
                <div className="message-bubble-right">
                    <div className="message-filler-left"><Typography variant="caption" color="textSecondary">{message.formatedTimeStamp}</Typography></div>
                    <div className="message-content-right" style={{backgroundColor: user && user.color}}>{message.message}</div>
                </div>
            )
        }
        return (
            <div className="message-bubble-left">
                <div className="message-content-left">
                    <div className="message-content-username"><Typography variant="caption" color="textSecondary">{`${message.userId} ${message.formatedTimeStamp}`}</Typography></div>
                    <br/>
                    <div className="message-content-message" style={{backgroundColor: user && user.color}} >{message.message}</div>
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
        </div>
      );
    }
    
export default ChatOutput;
    