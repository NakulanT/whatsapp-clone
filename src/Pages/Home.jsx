import React, { useState, useEffect } from "react";
import "./Home.css";
import ChatProfile from "../components/ChatProfile";
import Auth from "./Auth.jsx";
import LogoutIcon from '@mui/icons-material/Logout';
import ChatHistory from "../components/ChatHistory.jsx";
import { app } from "../FirebaseConfig.js";
import { getDatabase, ref, query, orderByChild, equalTo, set, onValue ,get } from "firebase/database";

const db = getDatabase(app);

const Home = (props) => {
    const [selectedContact, setSelectedContact] = useState(props.username);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [chatProfiles, setChatProfiles] = useState([]);

    const handleContactClick = (name) => {
        setSelectedContact(name);
        createChat(name);
    };

    const searchUsers = async () => {
        try {
            const usersRef = ref(db, 'Users');
            const usersQuery = query(usersRef, orderByChild('username'), equalTo(searchQuery));

            onValue(usersQuery, (snapshot) => {
                if (snapshot.exists()) {
                    const userData = snapshot.val();
                    const userList = Object.keys(userData).map((key) => ({
                        username: userData[key].username,
                        name: key,
                    }));
                    setSearchResults(userList);
                } else {
                    setSearchResults([]);
                }
            });
        } catch (error) {
            console.error(`Error searching users: ${error.message}`);
        }
    };

    useEffect(() => {
        if (searchQuery.trim() !== '') {
            searchUsers();
        }
    }, [searchQuery]);

    const handleSearch = (event) => {
        event.preventDefault();
        searchUsers();
    };

    const createChat = async (receiverUsername) => {
        try {
            const senderUsername = props.username;
            const chatRef = ref(db, `Users/${senderUsername}/chats/${receiverUsername}`);

            const chatSnapshot = await get(chatRef);
            if (!chatSnapshot.exists()) {
                // Chat doesn't exist, create it
                await set(chatRef, []);
                console.log(`Chat created between ${senderUsername} and ${receiverUsername}`);
            } else {
                console.log(`Chat already exists between ${senderUsername} and ${receiverUsername}`);
            }
        } catch (error) {
            console.error(`Error creating/checking chat: ${error.message}`);
        }
    };


    const loadPreviousChats = () => {
      try {
          const chatRef = ref(db, `Users/${props.username}/chats`);
  
          onValue(chatRef, (snapshot) => {
              const chatData = snapshot.val();
              if (chatData) {
                  const profiles = Object.entries(chatData).map(([key, value], index) => (
                      <ChatProfile key={index} name={key} onClick={() => handleContactClick(value)} />
                  ));
                  setChatProfiles(profiles);
              } else {
                  setChatProfiles([]);
              }
          });
      } catch (error) {
          console.log(error);
          setChatProfiles([]);
      }
  };
  

    useEffect(() => {
        loadPreviousChats();
    }, [props.username]);

    return (
        <div className="Home">
            <div className="HomePage">
                <div className="Nav">
                    <img src={props.picture} alt="profile" />
                    <h1>{props.name}</h1>
                    <h1>{props.username}</h1>
                    <a href={<Auth />}><LogoutIcon /></a>
                </div>
                <div className="Contacts">
                    <div className="Search">
                        <form onSubmit={handleSearch}>
                            <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search by username" />
                            <button type="submit">Search</button>
                        </form>
                    </div>
                    {searchResults.map((user, index) => (
                        <ChatProfile key={index} name={user.username} onClick={() => handleContactClick(user.username)} />
                    ))}
                    {chatProfiles}
                </div>
                <div className="ContactCard">
                    <ChatHistory senderUsername={props.username} receiverUsername={selectedContact} />
                </div>
            </div>
        </div>
    );
};

export default Home;
