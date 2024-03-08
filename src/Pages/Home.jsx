import React, { useState } from "react";
import "./Home.css";
import ChatProfile from "../components/ChatProfile";

const Home = () => {
    const [selectedContact, setSelectedContact] = useState(null);
    const handleProfileClick = (name) => {
        setSelectedContact(name);
    };
    return (
        <div className="Home">
            <div className="HomePage">
                <div className="Nav">
                    <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/dheereshagrwal/colored-icons@1.7.4/src/app/ci.min.css" />
                    <i className="ci ci-whatsapp ci-1x"></i>
                    <h1>Whatsapp Web</h1>
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
                {selectedContact && <h1>{selectedContact}</h1>}
                    
                </div>
            </div>
        </div>
    );
}

export default Home;
