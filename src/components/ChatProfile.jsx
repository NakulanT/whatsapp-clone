import React from "react";
import Person4Icon from '@mui/icons-material/Person4';
import './ChatProfile.css'

const ChatProfile = () => {
    return (
        <div className="ChatProfile">
            <div>
                <Person4Icon />
            </div>
            <div className="latestMessage">
                Hai
            </div>
        </div>
    );
}

export default ChatProfile;