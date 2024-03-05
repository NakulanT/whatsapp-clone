import React from "react";
import "./Home.css";

const Home = () => {
    return (
        <div className="Home">
            <div className="HomePage">
                <div className="Nav">
                <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/dheereshagrwal/colored-icons@1.7.4/src/app/ci.min.css" />
                <i className="ci ci-whatsapp ci-1x"></i>
                <h1>Whatsapp Web</h1>
                </div>
                <div className="Contacts"></div>
                <div className="ContactCard"></div>
            </div>
        </div>
    );
}

export default Home;
