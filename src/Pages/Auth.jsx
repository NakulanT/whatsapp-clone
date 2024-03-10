import React, { useState, useEffect } from 'react';
import { GoogleLogin, useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import Home from './Home';
import './Auth.css';

import { app } from "../FirebaseConfig.js";
import { getDatabase, ref, set, get } from "firebase/database"; // Import get function

const db = getDatabase(app);

function App() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [userData, setUserData] = useState(null);
    const [username, setUsername] = useState('');
    const [showAuth, setShowAuth] = useState(true);

    const login = useGoogleLogin({
        onSuccess: (codeResponse) => setUser(codeResponse),
        onError: (error) => console.log('Login Failed:', error)
    });

    useEffect(() => {
        const fetchProfile = async () => {
            if (user) {
                try {
                    setLoading(true);
                    const res = await axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`, {
                        headers: {
                            Authorization: `Bearer ${user.access_token}`,
                            Accept: 'application/json'
                        }
                    });
                    console.log("Name:", res.data.name);
                    console.log("Email:", res.data.email);

                    // Set user data
                    setUserData({
                        name: res.data.name,
                        email: res.data.email,
                        picture: res.data.picture // Assuming 'picture' is available in the response
                    });
                } catch (error) {
                    console.log(error);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchProfile();
    }, [user]);

    const handleUsernameChange = (e) => {
        setUsername(e.target.value);
    };

    const handleSubmit = async (e) => { // Define e
        e.preventDefault();
        try {
            const userRef = ref(db, `Users/${username}`);
            const userSnapshot = await get(userRef);
            if (userSnapshot.exists()) {
                alert("Username alredy exits")
                setShowAuth(false); // Hide authentication form
            }
        } catch (error) {
            console.error(`Error checking user: ${error.message}`);
        }
    };

    if (user && userData && showAuth) {
        return <Home name={userData.name} email={userData.email} picture={userData.picture} username={username} />;
    } else {
        return (
            <div className="Authpage">
                <div className="AuthNav">
                    {console.log(userData,username)}
                    <link
                        rel="stylesheet"
                        href="https://cdn.jsdelivr.net/gh/dheereshagrwal/colored-icons@1.7.4/src/app/ci.min.css"
                    />
                    <i className="ci ci-whatsapp ci-2x"></i>
                    <h1>Whatsapp Web</h1>
                </div>
                <div className="AuthCard">
                    <h1>Sign in with your Google account</h1>
                    <GoogleLogin
                        clientId="692055383262-r0t5oab7muk0fee2lgk39a5tpgdilmm7.apps.googleusercontent.com"
                        buttonText="Sign in with Google 🚀"
                        onSuccess={login}
                        onFailure={login}
                    />
                    {showAuth && (
                        <form onSubmit={handleSubmit}>
                            <input
                                type="text"
                                placeholder="Enter username"
                                value={username}
                                onChange={handleUsernameChange}
                            />
                            <button type="submit">Submit</button>
                        </form>
                    )}
                </div>
            </div>
        );
    }
}

export default App;
