import React, { useState } from 'react';
import './css/App.css';

import 'bootstrap/dist/css/bootstrap.min.css';
import ChatPage from './components/chatPage/ChatPage';
import LoginSignup from './components/login-signupPage/LoginSignup';

const App = () => {
  const [isLoggedin, setIsLoggedIn] = useState(false);

  const displayPage = isLoggedin ? <ChatPage /> : <LoginSignup />;

  return <div className='App'>{displayPage}</div>;
};

export default App;
