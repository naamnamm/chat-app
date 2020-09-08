import React, { useState } from 'react';
import './css/App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import ChatRoom from './components/chatroom/ChatRoom';
import LoginSignup from './components/login-signupPage/LoginSignup';

const App = () => {
  const [isLoggedin, setIsLoggedIn] = useState(true);

  const displayPage = isLoggedin ? <ChatRoom /> : <LoginSignup />;

  return <div className='App'>{displayPage}</div>;
};

export default App;
