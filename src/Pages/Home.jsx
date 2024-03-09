import React, { useState } from "react";
import "./Home.css";
import ChatProfile from "../components/ChatProfile";
import Auth from "./Auth.jsx"
import LogoutIcon from '@mui/icons-material/Logout';
import ChatHistory from "../components/ChatHistory.jsx";

const Home = (props) => {
    const [selectedContact, setSelectedContact] = useState("");
    const handleProfileClick = (name) => {
        setSelectedContact(name);
    };
    return (
        <div className="Home">
            <div className="HomePage">
                <div className="Nav">
                    <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/dheereshagrwal/colored-icons@1.7.4/src/app/ci.min.css" />
                    <img src = {props.picture} alt="profile"/>
                    <h1>{props.name}</h1>
                    <a href={<Auth />}> <LogoutIcon /> </a>
                </div>
                <div className="Contacts">
                    <ChatProfile name="batman" onClick={handleProfileClick} />
                    <ChatProfile name="joker" onClick={handleProfileClick} />
                    <ChatProfile name="Superman" onClick={handleProfileClick} />
                    <ChatProfile name="Captain America" onClick={handleProfileClick} />
                    <ChatProfile name="Thor" onClick={handleProfileClick} />
                    <ChatProfile name="Ironman" onClick={handleProfileClick} />
                </div>
                <div className="ContactCard">
                <ChatHistory name ={selectedContact}/>                   
                </div>
            </div>
        </div>
    );
}

export default Home;
