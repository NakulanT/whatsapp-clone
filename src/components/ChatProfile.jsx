import React from "react";
import Person4Icon from '@mui/icons-material/Person4';
import './ChatProfile.css'

const ChatProfile = ({name , onClick}) => {
    const handleClick = () => {
        onClick(name);
    };
    return (
        <div className="ChatProfile" onClick={handleClick}>
            <div>
                <Person4Icon />
            </div>
            <div className="latestMessage">
                {name}
            </div>
        </div>
    );
}

export default ChatProfile;