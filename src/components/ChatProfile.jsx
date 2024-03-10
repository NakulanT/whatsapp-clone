// ChatProfile.jsx
import React from "react";
import Person4Icon from '@mui/icons-material/Person4';
import './ChatProfile.css';
import { app } from "../FirebaseConfig";
import { getDatabase , ref ,set} from "firebase/database";

const db = getDatabase(app); 
const ChatProfile = ({ name, onClick }) => {

    const handleClick = async () => {
        try {
        //   const userRef = ref(db, `Users/${name}`);
    
        //   const userData = {
        //     name: name,
        // };
        
        //   await set(userRef, userData);
    
          console.log(`User "${name}" successfully added to database!`); // Success message
        } catch (error) {
          console.error(`Error adding user: ${error.message}`); // Error handling
        }
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
