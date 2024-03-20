import React, { useState, useEffect, useRef } from "react";
import './ChatHistory.css';
import SendIcon from '@mui/icons-material/Send';
import { app } from "../FirebaseConfig.js";
import { getDatabase, ref, push, onValue, get } from "firebase/database";
import DoneIcon from '@mui/icons-material/Done';
import DoneAllIcon from '@mui/icons-material/DoneAll';

const db = getDatabase(app);

const ChatHistory = (props) => {
    const [message, setMessage] = useState('');
    const [history, setHistory] = useState([]);
    const messagesEndRef = useRef(null);
    const [senderProfilePicture, setSenderProfilePicture] = useState('');
    const [receiverProfilePicture, setReceiverProfilePicture] = useState('');

    useEffect(() => {
        const chatRef = ref(db, `Users/${props.senderUsername}/chats/${props.receiverUsername}`);
        onValue(chatRef, (snapshot) => {
            const chatData = snapshot.val();
            if (chatData) {
                const chatHistory = Object.values(chatData);
                setHistory(chatHistory);
                scrollToBottom();
            } else {
                setHistory([]);
            }
        });
    }, [props.senderUsername, props.receiverUsername]);

    useEffect(() => {
        fetchProfilePicture(props.senderUsername, setSenderProfilePicture);
        fetchProfilePicture(props.receiverUsername, setReceiverProfilePicture);
    }, [props.senderUsername, props.receiverUsername]);

    const fetchProfilePicture = async (username, setProfilePicture) => {
        try {
            const pictureRef = ref(db, `Users/${username}/picture`);
            const pictureSnapshot = await get(pictureRef);
            if (pictureSnapshot.exists()) {
                setProfilePicture(pictureSnapshot.val());
            }
        } catch (error) {
            console.error(`Error fetching profile picture for ${username}:`, error);
        }
    };

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
            const newMessage = { content: message, role: 'user', timestamp: new Date().toISOString() }; // Include timestamp
            setHistory(prevHistory => [...prevHistory, newMessage]);
            saveMessageToDatabase(newMessage);
            setMessage('');
        }
    };

    const saveMessageToDatabase = (newMessage) => {
        try {
            const senderChatRef = ref(db, `Users/${props.senderUsername}/chats/${props.receiverUsername}`);
            push(senderChatRef, newMessage);

            if (props.senderUsername !== props.receiverUsername) {
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
            const { role, content, timestamp } = msg;
            const profilePicture = role === 'user' ? senderProfilePicture : receiverProfilePicture;
            const formattedTimestamp = new Date(timestamp).toLocaleString(undefined, {
                year: 'numeric',
                month: 'numeric',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
                hour12: true,
            });
            

            if (role === 'user') {
                return (
                    <div key={index} className="Messages-right">
                        <img src={profilePicture} alt="Profile" className="Profile-picture" />
                        <h5>{content}</h5><br></br>
                        <h6>{formattedTimestamp}</h6>
                        <div></div>
                    </div>
                );
            } else {
                return (
                    <div key={index} className="Messages-left">
                        <img src={profilePicture} alt="Profile" className="Profile-picture" />
                        <h5>{content}</h5>
                        <h6>{formattedTimestamp}</h6>
                        <div></div>
                    </div>
                );
            }
        });
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
