import React, { useState } from 'react';
import './css/App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import ChatRoom from './components/chatroom/ChatRoom';
import LoginSignup from './components/login-signupPage/LoginSignup';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleClick = (e) => {
    console.log(e.target);
  };

  const displayPage =
    isLoggedIn === true ? (
      <ChatRoom />
    ) : (
      <LoginSignup handleClick={handleClick} />
    );

  return <div className='App'>{displayPage}</div>;
};

export default App;
