import React, { useState, useEffect } from 'react';
import './css/App.css';
import ChatRoom from './components/chatroom/ChatRoom';
import LoginSignup from './components/login-signupPage/LoginSignup';
import io from 'socket.io-client';

const socket = io('http://localhost:5000/');

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState([]);
  const [username, setUsername] = useState([]);
  const [accessToken, setAccessToken] = useState('');

  const displayPage =
    isLoggedIn === true ? (
      <ChatRoom
        username={username}
        user={user}
        handleLoggedIn={setIsLoggedIn}
        accessToken={accessToken}
      />
    ) : (
      <LoginSignup
        onUserSubmit={setUser}
        onUsernameSubmit={setUsername}
        handleLoggedin={setIsLoggedIn}
        getAccessToken={setAccessToken}
      />
    );

  return (
    <div className='App'>
      {displayPage}
      {username}
    </div>
  );
};

export default App;
