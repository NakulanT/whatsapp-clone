import React from "react";
import Auth from "./Pages/Auth.jsx";
import Home from "./Pages/Home.jsx";

const Routes = () => {
    return(
        <div>
            {<Auth />
            }
            <Home />

        </div>
    );
}

export default Routes;