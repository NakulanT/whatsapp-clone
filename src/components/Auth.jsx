import React from "react";
import './Auth.css';

const Auth = () => {
    return (
        <div>
            <div className="AuthNav">
                <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/dheereshagrwal/colored-icons@1.7.4/src/app/ci.min.css" />
                <i class="ci ci-whatsapp ci-2x"></i>
                <h1>Whatsapp Web</h1>
            </div>
            <div className="AuthCard">
                <div>
                    <h1>Sigin in with your google account</h1>
                    <div>
                        contiune with google
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Auth;