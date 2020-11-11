import React,  {Fragment, useEffect, useState }from 'react';
import '../styles/App.css';
import { 
    TextField, 
} from '@material-ui/core';

function ChatInput(props) {
    return (
        <TextField className="chat-input-field" id="filled-basic" label="Chat!" variant="filled" />
      );
    }
    
export default ChatInput;
    