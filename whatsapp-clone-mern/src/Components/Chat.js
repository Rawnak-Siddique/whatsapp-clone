import { Avatar, IconButton } from '@material-ui/core';
import React, { useState } from 'react'
import './Chat.css';
import SearchOutlinedIcon from '@material-ui/icons/SearchOutlined';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon';
import MicIcon from '@material-ui/icons/Mic';
import axios from './axios';

const Chat = ({ messages }) => {
    const  [input, SetInput] = useState("");

    const sendMessage = async (e) =>  {
        e.preventDefault();
        await axios.post('/messages/new', {
            message: input,
            name: "Demo name",
            timestamp: "Just now!",
            received: false,
        });

        SetInput("");
    };
    return (
        <div className="chat" >
            <div className="chat__header">
                <Avatar />
                <div className="chat__headerInfo">
                    <h3>Room name</h3>
                    <p>Last seen at...</p>
                </div>
                <div className="chat__headerRight">
                    <IconButton>
                        <SearchOutlinedIcon />
                    </IconButton>
                    <IconButton>
                        <AttachFileIcon />
                    </IconButton>
                    <IconButton>
                        <MoreVertIcon />
                    </IconButton>
                </div>
            </div>
            <div className="chat__body">
                {messages.map(messages  => (
                     <p className={`chat__message ${messages.received && "chat__reciever"}`} >
                     <span className="chat__name" >{messages.name}</span>
                      {messages.message}
                     <span className="chat__timestamp" >{messages.timestamp}</span>
                 </p>
                ))}
            </div>
            <div className="chat__footer">
                <InsertEmoticonIcon />
                <form>
                    <input value={input} onChange={(e) => SetInput(e.target.value)} placeholder="Type a message" type="text" />
                    <button onClick={sendMessage} type="submit" >
                        send a message
                    </button>
                </form>
                <MicIcon />
            </div>
        </div>
    )
}

export default Chat;
