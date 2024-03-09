import React, { useState, useEffect, useRef } from "react";
import './ChatHistory.css';
import SendIcon from '@mui/icons-material/Send';

const ChatHistory = (props) => {
    const [message, setMessage] = useState('');
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }

    useEffect(() => {
        scrollToBottom(); // Scroll to bottom when component mounts
    }, []); // Empty dependency array to ensure the effect runs only once after mounting

    const handleSubmit = (event) => {
        event.preventDefault(); 
        console.log('Submitted message:', message);
        setMessage('');
        scrollToBottom(); 
    }

    const handleChange = (event) => {
        setMessage(event.target.value); 
    }

    return (
        <div className="ChatHistory">
            <div className="Messages">
                {/* Render messages here */}
                <div></div>
                <div className="Messages-left">
                    <h5>
                        hai
                    </h5>
                </div>
                <div className="Messages-right">
                    <h5>
                        hello
                    </h5>
                </div>
                <div className="Messages-left">
                    <h5>
                        how are you
                    </h5>
                </div>
                <div className="Messages-right">
                    <h5>
                        I am fine , wau ??
                    </h5>
                </div>
                <div className="Messages-left">
                    <h5>
                        yes ice
                    </h5>
                </div>
                <div className="Messages-right">
                    <h5>
                        ok bye
                    </h5>
                </div>
                <div className="Messages-left">
                    <h5>
                        see you boy
                    </h5>
                </div>
                <div className="Messages-right">
                    <h5>
                       hahaha
                    </h5>
                </div>
                <div className="Messages-right">
                    <h5>
                       hoho ho
                    </h5>
                </div>
                <div className="Messages-left">
                    <h5>
                        hai
                    </h5>
                </div>
                <div className="Messages-right">
                    <h5>
                        hello
                    </h5>
                </div>
                <div className="Messages-left">
                    <h5>
                        how are you
                    </h5>
                </div>
                <div className="Messages-right">
                    <h5>
                        I am fine , wau ??
                    </h5>
                </div>
                <div className="Messages-left">
                    <h5>
                        yes ice
                    </h5>
                </div>
                <div className="Messages-right">
                    <h5>
                        ok bye
                    </h5>
                </div>
                <div className="Messages-left">
                    <h5>
                        see you boy
                    </h5>
                </div>
                <div className="Messages-right">
                    <h5>
                       hahaha
                    </h5>
                </div>
                <div className="Messages-right">
                    <h5>
                       hoho ho
                    </h5>
                </div>



                <div ref={messagesEndRef} /> {/* Reference for scrolling to bottom */}
            </div>
            <div className="SendMessage">
                <form onSubmit={handleSubmit}>
                    <input type="text" id="chatInput" value={message} onChange={handleChange} placeholder="Chat here"></input>
                    <button type="submit" id="submitButton"><SendIcon fontSize="large" /></button>
                </form>
            </div>
        </div>
    );
}

export default ChatHistory;
