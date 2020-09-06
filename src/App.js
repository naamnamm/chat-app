import React from 'react';
import './css/App.css';
import Login from './components/Login';
import 'bootstrap/dist/css/bootstrap.min.css';
import ChatPage from './components/ChatPage';

function App() {
  return (
    <div className='App'>
      {/* <Login /> */}
      <ChatPage />
    </div>
  );
}

export default App;
