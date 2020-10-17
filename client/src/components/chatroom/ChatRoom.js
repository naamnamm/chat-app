import React, { useState, useEffect } from 'react';
import { Button, Navbar, Nav, InputGroup, Form } from 'react-bootstrap';
import './ChatRoom.css';
import { FaSmile, FaUsers } from 'react-icons/fa';
import io from 'socket.io-client';
import ScrollableFeed from 'react-scrollable-feed';
import Message from './Message';

const socket = io('http://localhost:5000/');

const Chatroom = ({ user, username, handleLoggedIn, accessToken }) => {
  const [messages, setMessages] = useState([]);
  const [msgInput, setMsgInput] = useState('');
  const [users, setUsers] = useState([]);
  const [savedToken, setSavedToken] = useState([]);

  const handleClick = async (msgInput) => {
    if (!msgInput) return;
    console.log('post user =', user);
    //socket.emit('chatMsg', msgInput);

    try {
      const message = msgInput;
      const config = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token || savedToken}`,
        },
        body: JSON.stringify({ user, message }),
      };
      const response = await fetch('/users/post', config);
      const msgData = await response.json();
      console.log('response from a server =', msgData);
    } catch (error) {
      console.log(error);
    }

    setMsgInput('');
  };

  const setLoggedOut = async () => {
    console.log('test loggedout =', user);
    try {
      const config = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user }),
      };

      const response = await fetch('/users/logout', config);
      // const loggedOutData = await response.json();
      // console.log(response);

      if (response.ok) {
        handleLoggedIn(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    //fetch log-in for a single user
    fetch(`/users/login/:${username}`)
      .then((res) => res.json())
      .then((data) => {
        console.log('logged-in user =', data);
        setUsers(data);
      });

    // can't remove this, otherwise welcome message won't work
    socket.emit('loggedIn', { username });

    socket.on('message', (msg) => {
      setMessages((messages) => [...messages, msg]);
    });

    socket.on('new-login', ({ activeUsers }) => {
      setUsers(activeUsers);
    });

    socket.on('user-leave', ({ activeUsers }) => {
      setUsers(activeUsers);
    });

    const existingAccessToken = localStorage.getItem('accessToken');

    if (existingAccessToken) {
      setSavedToken(JSON.parse(existingAccessToken));
      console.log(savedToken);
      handleLoggedIn(true);
    } else {
      localStorage.setItem('accessToken', JSON.stringify(accessToken));
      setSavedToken(JSON.parse(localStorage.getItem('accessToken')));
      console.log(savedToken);
      handleLoggedIn(true);
    }
  }, []);

  // if (user.token != null) {
  //   stayLoggedIn(true);
  // }

  const displayMsgs = messages.map((msg, index) => (
    <Message key={index} msg={msg} currentUser={username} />
  ));

  const displayActiveUsers =
    users.length >= 1
      ? users.map((user, index) => <li key={index}> {user.username}</li>)
      : null;

  return (
    <div className='chat-container mx-auto mt-5'>
      <div className='header'>
        <Navbar>
          <Navbar.Brand>
            <FaSmile />
          </Navbar.Brand>

          <Nav className='ml-auto'>
            <Button onClick={() => setLoggedOut()}>Log out</Button>
          </Nav>
        </Navbar>
      </div>

      <div className='main d-flex'>
        <div className='chat-sidebar'>
          <div>
            <FaUsers /> Active Users
          </div>
          <ul>{displayActiveUsers}</ul>
        </div>

        <div className='chat-main'>
          <ScrollableFeed>{displayMsgs}</ScrollableFeed>
        </div>
      </div>

      <Form className='input-msg'>
        <InputGroup className='py-2 px-5'>
          <Form.Control
            placeholder='Write a message...'
            onChange={(e) => setMsgInput(e.target.value)}
            value={msgInput}
          />
          <InputGroup.Append>
            <Button
              variant='outline-secondary'
              onClick={() => handleClick(msgInput)}
            >
              Send
            </Button>
          </InputGroup.Append>
        </InputGroup>
      </Form>
    </div>
  );
};

export default Chatroom;

{
  /* <div className='message'>
  <Toast className='ml-auto mb-0'>
    {' '}
    <Toast.Body>Hello, world! This is a toast message.</Toast.Body>
  </Toast>
  <div className='text-right'>Naam 8:30 am</div>
</div>

<div className='message'>
  <div className='text-muted'>Ben has joined</div>
  <Toast className='mr-auto mb-0'>
    {' '}
    <Toast.Body>Hello, world! This is a toast message.</Toast.Body>
  </Toast>
  <div className='text-left'>Ben 8:32 am</div>
</div> */
  // fetch('/users?active=true')
  //   .then((res) => res.json())
  //   .then((data) => setUsers(data));
}
