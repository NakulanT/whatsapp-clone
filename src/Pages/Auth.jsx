import React, { useState, useEffect } from 'react';
import { GoogleLogin, useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import Home from './Home';
import './Auth.css';

import { app } from '../FirebaseConfig.js';
import { getDatabase, ref, set, get, push } from 'firebase/database';

const db = getDatabase(app);

function App() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [userData, setUserData] = useState(null);
    const [username, setUsername] = useState('');
    const [showAuth, setShowAuth] = useState(false);
    const [Siginin, showSignin] = useState(false);
    const [AlertMessage , SetAlertMessage] = useState('');

    const login = useGoogleLogin({
        onSuccess: (codeResponse) => setUser(codeResponse),
        onError: (error) => console.log('Login Failed:', error)
    });

    useEffect(() => {
        const fetchProfile = async () => {
            console.log(showAuth)
            if (user) {
                try {
                    setLoading(true);
                    const res = await axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`, {
                        headers: {
                            Authorization: `Bearer ${user.access_token}`,
                            Accept: 'application/json'
                        }
                    });

                    setUserData({
                        name: res.data.name,
                        email: res.data.email,
                        picture: res.data.picture
                    });

                } catch (error) {
                    console.log(error);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchProfile();
    }, [user, userData]);

    const handleUsernameChange = (e) => {
        setUsername(e.target.value);
    };
    const encodeEmail = (email) => {
        return email.replace('.', '_').replace('@', '_');
    };

    const Continue = async () => {
        console.log(username, userData, showAuth);
        try {
            if (userData) {
                // Check if the email is already registered in the members collection
                const emailRef = ref(db, `members/${encodeEmail(userData.email)}`);
                const emailSnapshot = await get(emailRef);

                // Check if the username already exists in the Users collection
                const usernameRef = ref(db, `Users/${username}`);
                const usernameSnapshot = await get(usernameRef);

                if (!emailSnapshot.exists() && usernameSnapshot.exists()) {
                    alert("Username is not registered. Please sign up.");
                    setShowAuth(false);
                } else if (emailSnapshot.exists()) {
                    setShowAuth(true);
                } else if (!emailSnapshot.exists() && !usernameSnapshot.exists()) {

                    await set(emailRef, {
                        email: userData.email
                    });

                    await set(usernameRef, {
                        email: userData.email,
                    });

                    setShowAuth(true);
                }
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };


    if (user && userData && showAuth) {
        return <Home name={userData.name} email={userData.email} picture={userData.picture} username={username} />;
    } else {
        return (
            <div className="Authpage">
                <div className="AuthNav">
                    <link
                        rel="stylesheet"
                        href="https://cdn.jsdelivr.net/gh/dheereshagrwal/colored-icons@1.7.4/src/app/ci.min.css"
                    />
                    <i className="ci ci-whatsapp ci-2x"></i>
                    <h1>Whatsapp Web</h1>
                </div>
                <div className="AuthCard">

                    <div className='CardSelector'>
                    <a id="Signup" className={Siginin ? 'active' : ''} onClick={() => showSignin(false)}>Sign Up</a>
                    <a id="Signin" className={!Siginin ? 'active' : ''} onClick={() => showSignin(true)}>Sign In</a>

                    </div>
                    <div className='AlertMessages'>{AlertMessage}</div>
                    {Siginin ? (
                        <div className='Siginin'>
                            <GoogleLogin
                                clientId="692055383262-r0t5oab7muk0fee2lgk39a5tpgdilmm7.apps.googleusercontent.com"
                                buttonText="Sign in with Google 🚀"
                                onSuccess={login}
                                onFailure={login}
                            />
                        </div>
                    ) : (
                        <div className='Siginup'>
                            <form>
                                <input
                                    type="text"
                                    placeholder="Enter username"
                                    value={username}
                                    onChange={handleUsernameChange} // Listen for changes in the input field
                                />
                                <GoogleLogin
                                clientId="692055383262-r0t5oab7muk0fee2lgk39a5tpgdilmm7.apps.googleusercontent.com"
                                buttonText="Sign in with Google 🚀"
                                onSuccess={login}
                                onFailure={login}
                            />
                                <button type="button" onClick={Continue}>Register</button>
                            </form>
                        </div>
                    )}

                </div>
            </div>
        );
    }
}

export default App;