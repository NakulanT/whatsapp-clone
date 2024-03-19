import React, { useState, useEffect, useRef } from "react";
import './ChatHistory.css';
import SendIcon from '@mui/icons-material/Send';
import { app } from "../FirebaseConfig.js";
import { getDatabase, ref, push, onValue } from "firebase/database";
import DoneIcon from '@mui/icons-material/Done';
import DoneAllIcon from '@mui/icons-material/DoneAll';

const db = getDatabase(app);

const ChatHistory = (props) => {
    const [message, setMessage] = useState('');
    const messagesEndRef = useRef(null);
    const [history, setHistory] = useState([]);

    useEffect(() => {
        const chatRef = ref(db, `Users/${props.senderUsername}/chats/${props.receiverUsername}`);
        onValue(chatRef, (snapshot) => {
            const chatData = snapshot.val();
            if (chatData) {
                const chatHistory = Object.values(chatData);
                setHistory(chatHistory);
                scrollToBottom();
            }
            else{
                setHistory([]);
            }
        });
    }, [props.senderUsername, props.receiverUsername]);

    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [history]);

    const handleSubmit = (event) => {
        event.preventDefault();
        if (message.trim() !== '') {
            const newMessage = { content: message, role: 'user' }; // Role set as "user" for sender
            setHistory(prevHistory => [...prevHistory, newMessage]);
            saveMessageToDatabase(newMessage);
            setMessage('');
        }
    };

    const saveMessageToDatabase = (newMessage) => {
        try {
            // Save message in sender's chat reference with role as "user"
            const senderChatRef = ref(db, `Users/${props.senderUsername}/chats/${props.receiverUsername}`);
            push(senderChatRef, newMessage);

            if (props.senderUsername !== props.receiverUsername){

            // Save message in receiver's chat reference with role as "contact"
            const receiverChatRef = ref(db, `Users/${props.receiverUsername}/chats/${props.senderUsername}`);
            push(receiverChatRef, { ...newMessage, role: 'contact' });
        }
        } catch (error) {
            console.error(`Error saving message to database: ${error.message}`);
        }
    };

    const handleChange = (event) => {
        setMessage(event.target.value);
    };

    const renderMessages = () => {
        return history.map((msg, index) => {
            const { role, content } = msg;
            if (role === 'user') {
                return (
                    <div key={index} className="Messages-right">
                        <div></div>
                        <h5>{content}</h5>
                        <DoneIcon className="DoneIcon" />
                    </div>
                );
            } else {
                return (
                    <div key={index} className="Messages-left">
                        <div></div>
                        <h5>{content}</h5>
                        <DoneAllIcon className="DoneAllIcon" />
                    </div>
                );
            }
        });
    };

        const isLastMessageVisible = () => {
        if (messagesEndRef.current) {
            const { top } = messagesEndRef.current.getBoundingClientRect();
            const { height } = window.innerHeight;
            return top <= height;
        }
        return false;
    };

    return (
        <div className="ChatHistory">
            <div className="Informer">You are in {props.receiverUsername}'s page</div>
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
};

export default ChatHistory;