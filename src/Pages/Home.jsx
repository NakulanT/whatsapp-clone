import React, { useState, useEffect } from "react";
import "./Home.css";
import ChatProfile from "../components/ChatProfile";
import Auth from "./Auth.jsx";
import LogoutIcon from '@mui/icons-material/Logout';
import SearchIcon from '@mui/icons-material/Search';
import ChatHistory from "../components/ChatHistory.jsx";
import SettingsIcon from '@mui/icons-material/Settings';
import { app } from "../FirebaseConfig.js";
import { getDatabase, ref, query, orderByChild, equalTo, set, onValue, get } from "firebase/database";

const db = getDatabase(app);

const Home = (props) => {
    const [selectedContact, setSelectedContact] = useState(props.username);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [chatProfiles, setChatProfiles] = useState([]);

    // Function to handle contact clicks and update selectedContact state
    const handleContactClick = (name) => {
        setSelectedContact(name); // Update selectedContact state with the clicked contact's name
    };

    // Function to scroll to the bottom of the chat history
    const scrollToBottom = () => {
        const chatHistory = document.querySelector('.ChatHistory'); // Get the chat history element
        if (chatHistory) {
            chatHistory.scrollTop = chatHistory.scrollHeight; // Scroll to the bottom of the chat history
        }
    };

    // Function to search users based on the search query
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
                    setSearchResults(userList); // Update searchResults state with the search results
                } else {
                    setSearchResults([]); // Clear searchResults if no results found
                }
            });
        } catch (error) {
            console.error(`Error searching users: ${error.message}`);
        }
    };

    // Effect to trigger user search when searchQuery changes
    useEffect(() => {
        if (searchQuery.trim() !== '') {
            searchUsers(); // Call searchUsers function when searchQuery changes and is not empty
        }
    }, [searchQuery]);

    // Function to handle form submission for user search
    const handleSearch = (event) => {
        event.preventDefault();
        searchUsers(); // Call searchUsers function on form submission
    };

    // Function to create a chat between sender and receiver
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

    // Function to load previous chats for the current user
    const loadPreviousChats = () => {
        try {
            const chatRef = ref(db, `Users/${props.username}/chats`);

            onValue(chatRef, (snapshot) => {
                const chatData = snapshot.val();
                if (chatData) {
                    const profiles = Object.entries(chatData).map(([key, value], index) => {
                        if (key !== searchQuery) {
                            return (
                                <ChatProfile key={index} name={key} onClick={() => handleContactClick(key)} />
                            );
                        }

                    });
                    setChatProfiles(profiles); // Update chatProfiles state with chat profiles
                } else {
                    setChatProfiles([]);
                    // In this line I want to set the Sethistroy to null which is locted in profileHistroy jsx
                }
            });
        } catch (error) {
            console.log(error);
            setChatProfiles([]); // Clear chatProfiles on error
        }
    };

    // Effect to load previous chats when the component mounts or when username changes
    useEffect(() => {
        loadPreviousChats();
    }, [props.username]);

    // Effect to scroll to bottom when selectedContact changes
    useEffect(() => {
        scrollToBottom(); // Scroll to bottom when selected contact changes
    }, [selectedContact]);

    return (
        <div className="Home">
            <div className="HomePage">
                <div className="Nav">
                    <img src={props.picture} />
                    <h1>{props.username}</h1>
                    <div>
                        <a className="SettingIcon"><SettingsIcon /></a>
                        <a href={<Auth />} className="LogoutIcone"><LogoutIcon /></a>
                    </div>

                </div>
                <div className="Contacts">
                    <div className="Search">
                        <form onSubmit={handleSearch}>
                            <SearchIcon className="SearchIcon" />
                            <input type="text" value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value.toLowerCase()); loadPreviousChats(); }} placeholder="Search by username" />
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
