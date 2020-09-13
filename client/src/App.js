import React, { useState, useEffect } from 'react';
import './css/App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import ChatRoom from './components/chatroom/ChatRoom';
import LoginSignup from './components/login-signupPage/LoginSignup';
import io from 'socket.io-client';

const socket = io('http://localhost:5000/');

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  const handleClick = () => {
    setIsLoggedIn(true);
  };

  useEffect(() => {
    socket.on('msg', (msg) => {
      console.log(msg);
    });
  }, []);

  const displayPage =
    isLoggedIn === true ? (
      <ChatRoom />
    ) : (
      <LoginSignup handleClick={handleClick} />
    );

  return <div className='App'>{displayPage}</div>;
};

export default App;
