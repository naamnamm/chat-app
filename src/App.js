import React, { useState } from 'react';
import './css/App.css';
import Login from './components/Login';
import 'bootstrap/dist/css/bootstrap.min.css';
import ChatPage from './components/ChatPage';

const App = () => {
  const [isLoggedin, setIsLoggedIn] = useState(true);

  const displayPage = isLoggedin ? <ChatPage /> : <Login />;

  return <div className='App'>{displayPage}</div>;
};

export default App;
