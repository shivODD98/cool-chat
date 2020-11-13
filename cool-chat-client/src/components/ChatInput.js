import React,  {Fragment, useEffect, useState }from 'react';
import '../styles/App.css';
import { 
    TextField, 
} from '@material-ui/core';

function ChatInput(props) {
    const [message, setMessage] = useState('');
    const {
        sendMessage,
    } = props;

    const handleSubmit = (e) => {
        setMessage(e.target.value)
        if (e.key === 'Enter') {
           sendMessage(message);
           setMessage('');
        }
    } 

    return (
        <TextField value={message} className="chat-input-field" id="filled-basic" label="Chat!" variant="filled" onChange={handleSubmit} onKeyDown={handleSubmit}/>
      );
    }
    
export default ChatInput;
    