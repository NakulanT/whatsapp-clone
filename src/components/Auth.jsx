import React from "react";
import "./Auth.css"; // Assuming your CSS file is named Auth.css

const Auth = () => {
    return (
        <div className="Authpage"> {/* Added the Authpage class to the wrapper div */}
            <div className="AuthNav">
                <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/dheereshagrwal/colored-icons@1.7.4/src/app/ci.min.css" />
                <i className="ci ci-whatsapp ci-2x"></i>
                <h1>Whatsapp Web</h1>
            </div>
            <div className="AuthCard">
                    <h1>Sign in with your Google account</h1> {/* Corrected spelling of "Sign in" */}
                    <div className="GoogleContinue">Continue with Google</div> {/* Corrected spelling of "Continue" */}
            </div>
        </div>
    );
}

export default Auth;
