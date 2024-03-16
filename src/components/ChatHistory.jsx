import React, { useState, useEffect, useRef } from "react";
import './ChatHistory.css';
import SendIcon from '@mui/icons-material/Send';
import { app } from "../FirebaseConfig.js";
import { getDatabase, ref, push } from "firebase/database";

const db = getDatabase(app);

const ChatHistory = (props) => {
    const [message, setMessage] = useState('');
    const messagesEndRef = useRef(null);
    const [history, setHistory] = useState([]);

    useEffect(() => {
        scrollToBottom(); 
    }, [history]); 

    const scrollToBottom = () => {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        if (message.trim() !== '') {
            const newMessage = ["user", message];
            setHistory(prevHistory => [...prevHistory, newMessage]); 
            saveMessageToDatabase(newMessage); // Save message to database
            setMessage(''); 
            scrollToBottom();
        }
    }

    const saveMessageToDatabase = (newMessage) => {
        try {
            console.log(props)
            console.log(`Users/${props.senderUsername}/chats/${props.receiverUsername}`)
            const chatRef = ref(db, `Users/${props.senderUsername}/chats/${props.receiverUsername}`);
            push(chatRef, {
                role: newMessage[0],
                content: newMessage[1],
            });
        } catch (error) {
            console.error(`Error saving message to database: ${error.message}`);
        }
    };
    
    const handleChange = (event) => {
        setMessage(event.target.value);
    }

    const renderMessages = () => {
        return history.map((msg, index) => {
            const [role, content] = msg;
            if (role === 'user') {
                return (
                    <div key={index} className="Messages-right">
                        <div></div>
                        <h5>{content}</h5>
                    </div>
                );
            } else {
                return (
                    <div key={index} className="Messages-left">
                        <div></div>
                        <h5>{content}</h5>
                    </div>
                );
            }
        });
    };

    return (
        <div className="ChatHistory">
            <div className="Informer">Youre are in {props.receiverUsernam} page</div>
            <div className="Messages">
                {renderMessages()}
                <div ref={messagesEndRef} /> {/* Reference for scrolling to bottom */}
            </div>
            <div className="SendMessage">
                <form onSubmit={handleSubmit}>
                    <input type="text" id="chatInput" value={message} onChange={handleChange} placeholder="Chat here" />
                    <button type="submit" id="submitButton"><SendIcon fontSize="large" /></button>
                </form>
            </div>
        </div>
    );
}

export default ChatHistory;
