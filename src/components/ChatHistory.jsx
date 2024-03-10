import React, { useState, useEffect, useRef } from "react";
import './ChatHistory.css';
import SendIcon from '@mui/icons-material/Send';

const ChatHistory = (props) => {
    const [message, setMessage] = useState('');
    const messagesEndRef = useRef(null);
    const history = [
        ["user", "hai"],
        ["contact", "hello"],
        ["user", "how are you"],
        ["contact", "I am fine what about"],
        ["user", "I'm doing well, thanks for asking"],
        ["contact", "That's great to hear!"],
        ["user", "Do you have any plans for the weekend?"],
        ["contact", "Yes, I'm planning to go hiking with some friends."],
        ["user", "Sounds like fun! I love hiking."],
        ["contact", "Me too! It's a great way to relax and enjoy nature."],
        ["user", "Absolutely. Let me know if you need any hiking recommendations."],
        ["contact", "Thanks, I will!"],
        ["user", "By the way, have you seen the latest movie that came out?"],
        ["contact", "No, not yet. Is it any good?"],
        ["user", "Yes, it's getting really good reviews. We should go watch it together sometime."],
        ["contact", "That sounds like a plan! Let's make it happen."],
        ["user", "Great, I'll check the showtimes and let you know."],
        ["contact", "Looking forward to it!"],
        ["user", "Okay, talk to you later then."],
        ["contact", "Sure, bye for now!"],
        ["user", "2D feature-based alignment is widely used in applications such as image stitching, panorama creation, object recognition, and image registration. It is robust to changes in viewpoint, lighting conditions, and partial occlusions, making it suitable for a variety of real-world scenarios."],
    ];

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

    const renderMessages = () => {
        return history.map((msg, index) => {
            const [role, content] = msg;
            if (role === 'user') {
                return (
                    <div key={index} className="Messages-left">
                        <div></div>
                        <h5>{content}</h5>
                    </div>
                );
            } else {
                return (
                    <div key={index} className="Messages-right">
                        <div></div>
                        <h5>{content}</h5>
                    </div>
                );
            }
        });
    };

    return (
        <div className="ChatHistory">
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