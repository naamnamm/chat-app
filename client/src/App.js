import React, { useState, useEffect } from 'react';
import './css/App.css';
import ChatRoom from './components/chatroom/ChatRoom';
import LoginSignup from './components/login-signupPage/LoginSignup';
import io from 'socket.io-client';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from 'react-router-dom';

const socket = io();

const App = () => {
  const [user, setUser] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const setAuth = (boolean) => {
    setIsAuthenticated(boolean);
  };

  const verifyToken = async () => {
    try {
      const response = await fetch('users/verify-token', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${JSON.parse(
            localStorage.getItem('accessToken')
          )}`,
        },
      });

      const data = await response.json();

      if (data.isVerified === true) {
        setIsAuthenticated(true);
        setUser(data);
      } else {
        setIsAuthenticated(false);
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    verifyToken();
  }, []);

  return (
    <div className='App'>
      <Router>
        <div className='container'>
          <Switch>
            <Route
              exact
              path='/'
              render={(props) =>
                !isAuthenticated ? (
                  <LoginSignup
                    {...props}
                    onUserSubmit={setUser}
                    setAuth={setAuth}
                  />
                ) : (
                  <Redirect to='/chatroom' />
                )
              }
            />

            <Route
              exact
              path='/chatroom'
              render={(props) =>
                isAuthenticated ? (
                  <ChatRoom {...props} user={user} setAuth={setAuth} />
                ) : (
                  <Redirect to='/' />
                )
              }
            />
          </Switch>
        </div>
      </Router>
    </div>
  );
};

export default App;
