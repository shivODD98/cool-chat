import React,  {Fragment, useEffect, useState }from 'react';
import '../styles/App.css';
import ChatInput from './ChatInput';
import ChatOutput from './ChatOutput';
import UsersList from './UsersList';
import { 
    Paper, 
} from '@material-ui/core';

function ChatContainer(props) {
    return (
        <div className="chat-container-content">
            <div className="left-content-container">
                <Paper className="chat-content">
                    <div className="chat-output-container">
                        <ChatOutput/>
                    </div>
                    <div className="chat-input-container">
                        <ChatInput/>
                    </div>
                </Paper>
            </div>
            <div className="right-content-container">
                <Paper className="users-list">
                    <UsersList/>
                </Paper>
            </div>
        </div>
      );
    }
    
export default ChatContainer;
    