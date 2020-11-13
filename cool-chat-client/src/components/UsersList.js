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
    const {
        user,
        users,
    } = props;

    const renderUsersList = () => {
        return (
            <List subheader={<ListSubheader>Online Users</ListSubheader>} dense>
                {users.map((value) => {
                return (
                    <ListItem key={value} button>
                        <ListItemAvatar>
                            <Avatar
                            />
                        </ListItemAvatar>
                        <ListItemText primary={`${value.userId} ${value.userId === user.userId ? '(You)' : ''}`} />
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
    