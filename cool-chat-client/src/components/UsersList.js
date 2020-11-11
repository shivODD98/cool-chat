import React,  {Fragment, useEffect, useState }from 'react';
import '../styles/App.css';
import { 
    List,
    ListItem,
    ListItemAvatar,
    Avatar,
    ListItemText,
    ListSubheader,
} from '@material-ui/core';

function UsersList(props) {

    const renderUsersList = () => {
        return (
            <List subheader={<ListSubheader>Online Users</ListSubheader>} dense>
                {[0, 1, 2, 3].map((value) => {
                return (
                    <ListItem key={value} button>
                        <ListItemAvatar>
                            <Avatar
                            />
                        </ListItemAvatar>
                        <ListItemText primary={`Line item ${value + 1}`} />
                    </ListItem>
                );
                })}
            </List>
        )
    }

    return (
        renderUsersList()
      );
    }
    
export default UsersList;
    