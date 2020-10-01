import React, { useState, useEffect, useRef } from 'react';
import {
  Button,
  Toast,
  Navbar,
  Nav,
  InputGroup,
  FormControl,
  Form,
} from 'react-bootstrap';
import './ChatRoom.css';
import { FaSmile, FaUsers } from 'react-icons/fa';
import io from 'socket.io-client';
import ScrollableFeed from 'react-scrollable-feed';

const socket = io('http://localhost:5000/');

const Chatroom = ({ username }) => {
  const [messages, setMessages] = useState([]);
  const [msgInput, setMsgInput] = useState('');
  const [users, setUsers] = useState([]);

  const handleClick = (msgInput) => {
    socket.emit('chatMsg', msgInput);
    setMsgInput('');
  };

  const handleLogOut = () => {};

  useEffect(() => {
    //get active users
    fetch('/users?active=true')
      .then((res) => res.json())
      .then((data) => setUsers(data));

    socket.emit('loggedIn', { username });

    socket.on('message', (msg) => {
      console.log(msg);
      setMessages((messages) => [...messages, msg]);
    });

    socket.on('new-login', ({ activeUsers }) => {
      setUsers(activeUsers);
    });

    socket.on('user-leave', ({ activeUsers }) => {
      setUsers(activeUsers);
    });
  }, []);

  const displayMsgs = messages.map((msg, index) => (
    <div key={index} className='message'>
      <Toast className='ml-auto mb-0'>
        {' '}
        <Toast.Body>{msg.text}</Toast.Body>
      </Toast>
      <div className='text-right'>
        {msg.username} {msg.time}
      </div>
    </div>
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
            <Button onClick={() => handleLogOut()}>Log out</Button>
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
}
