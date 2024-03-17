import React, { useState, useEffect } from 'react';
import { GoogleLogin, useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import Home from './Home';
import './Auth.css';

import { app } from '../FirebaseConfig.js';
import { getDatabase, ref, set, get } from 'firebase/database';

const db = getDatabase(app);

function App() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [userData, setUserData] = useState(null);
    const [username, setUsername] = useState('');
    const [showAuth, setShowAuth] = useState(false);
    const [Siginin, showSignin] = useState(false);
    const [AlertMessage, SetAlertMessage] = useState('');

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
        const value = e.target.value;
        const validUsername = /^[a-z0-9_]*$/; // Regex for lowercase letters, numbers, and underscores only
    
        if (!validUsername.test(value)) {
            SetAlertMessage("Username can only contain lowercase letters, numbers, and underscores.");
        } else {
            SetAlertMessage('');
            setUsername(value);
        }
    };
    
    const encodeEmail = (email) => {
        return email.replace(/\./g, '_dot_').replace(/@/g, '_at_');
    };
    

    const handleSignIn = async () => {
        console.log(username, userData, showAuth);
        try {
            if (userData) {
                // Check if the email is already registered in the members collection
                const emailRef = ref(db, `members/${encodeEmail(userData.email)}`);
                const emailSnapshot = await get(emailRef);
    
                if (emailSnapshot.exists()) {
                    // Get the username from the members collection
                    const usernameRef = ref(db, `members/${encodeEmail(userData.email)}/username`);
                    const usernameSnapshot = await get(usernameRef);
    
                    if (usernameSnapshot.exists()) {
                        setUsername(usernameSnapshot.val()); // Update the username in the state
                        setShowAuth(true);
                    } else {
                        SetAlertMessage('Username is not registered. Please sign up.');
                        setShowAuth(false);
                    }
                } else {
                    SetAlertMessage('Email is not registered. Please sign up.');
                    setShowAuth(false);
                }
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };
    

    const handleSignUp = async () => {
        console.log(username, userData, showAuth);
        try {
            if (userData && username) { // Check if username is not empty
                // Check if the email is already registered in the members collection
                const emailRef = ref(db, `members/${encodeEmail(userData.email)}`);
                const emailSnapshot = await get(emailRef);
    
                // Check if the username already exists in the Users collection
                const usernameRef = ref(db, `Users/${username.replace('.', '_').replace('@', '_')}`); // Replace disallowed characters
                const usernameSnapshot = await get(usernameRef);
    
                if (emailSnapshot.exists() && usernameSnapshot.exists()) {
                    SetAlertMessage('Username and Email are already registered.');
                    setShowAuth(false);
                } else if (emailSnapshot.exists()) {
                    SetAlertMessage('Email is already registered. Please sign in.');
                    setShowAuth(false);
                } else if (!emailSnapshot.exists() && !usernameSnapshot.exists()) {
    
                    await set(emailRef, {
                        email: userData.email,
                        username : username
                    });
    
                    await set(usernameRef, {
                        email: userData.email,
                        username : username,
                        picture : userData.picture
                    });
    
                    setShowAuth(true);
                } else {
                    SetAlertMessage('Email is already registered. Please sign in.');
                    setShowAuth(false);
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
                    {Siginin ? (<h1 className='TitleCard'>Sign in</h1>) : (<h1>Sign up</h1>)}
                    <div className='AlertMessages'>{AlertMessage}</div>
                    {Siginin ? (
                        <div className='Signin'>
                            <GoogleLogin
                                clientId="692055383262-r0t5oab7muk0fee2lgk39a5tpgdilmm7.apps.googleusercontent.com"
                                buttonText="Sign in with Google 🚀"
                                onSuccess={login}
                                onFailure={login}
                                className = "GoogleLogin"
                            />
                            <button type="button" onClick={handleSignIn}>Sign in</button>
                        </div>
                    ) : (
                        <div className='Signup'>
                            <form>
                                <div className='Username' >
                                    <label>Username :</label>
                                <input
                                    type="text"
                                    placeholder="Enter username"
                                    value={username}
                                    onChange={handleUsernameChange} // Listen for changes in the input field
                                />
                                </div>
                                <GoogleLogin
                                    clientId="692055383262-r0t5oab7muk0fee2lgk39a5tpgdilmm7.apps.googleusercontent.com"
                                    buttonText="Sign in with Google 🚀"
                                    onSuccess={login}
                                    onFailure={login}
                                    className = "GoogleLogin"
                                />
                                <button type="button" onClick={handleSignUp}>Register</button>
                            </form>
                        </div>
                    )}
                    <div className='CardSelector'>
                        {Siginin ? (
                            <a id="Signup" className={Siginin} onClick={() => {showSignin(false); SetAlertMessage('');}}>Don't have an account ? Signup</a>
                        ) : (<a id="Signin" className={!Siginin} onClick={() => {showSignin(true); SetAlertMessage('');}}>Already have an account ? Sign in</a>)}
                    </div>

                </div>
            </div>
        );
    }
}

export default App;
