import React, { useState, useEffect } from "react";
import Person4Icon from '@mui/icons-material/Person4';
import './ChatProfile.css';
import { app } from "../FirebaseConfig.js";
import { getDatabase, ref, get } from "firebase/database";

const db = getDatabase(app);

const ChatProfile = ({ name, onClick }) => {
    const [profilePicture, setProfilePicture] = useState('');

    useEffect(() => {
        const fetchProfilePicture = async () => {
            try {
                const pictureRef = ref(db, `Users/${name}/picture`);
                const pictureSnapshot = await get(pictureRef);
                if (pictureSnapshot.exists()) {
                    setProfilePicture(pictureSnapshot.val());
                }
            } catch (error) {
                console.error("Error fetching profile picture:", error);
            }
        };

        fetchProfilePicture();
    }, [name]);

    const handleClick = async () => {
        // Your logic for handling the click event
        onClick(name); // Call the onClick function with the name parameter
    };

    return (
        <div className="ChatProfile" onClick={handleClick}>
            <div className="ProfileIcon">
                    <img src={profilePicture} alt={<Person4Icon />} />
            </div>
            <div className="latestMessage">
                {name}
            </div>
        </div>
    );
}

export default ChatProfile;
