import React, { useState, useEffect } from 'react';
import { Button, Navbar, Nav, InputGroup, Form } from 'react-bootstrap';
import './ChatRoom.css';
import { FaSmile, FaUsers } from 'react-icons/fa';
import io from 'socket.io-client';
import ScrollableFeed from 'react-scrollable-feed';
import Messages from './Messages';

const socket = io('http://localhost:5000/');

const Chatroom = ({ user, setAuth }) => {
  const [messages, setMessages] = useState([]);
  const [msgInput, setMsgInput] = useState('');
  const [users, setUsers] = useState([]);
  const [channel, setChannel] = useState('general');

  const handleClick = async (msgInput) => {
    if (!msgInput) return;
    console.log('post user =', user);
    //socket.emit('chatMsg', msgInput);
    //console.log('user', user)

    try {
      const message = msgInput;
      const config = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${JSON.parse(
            localStorage.getItem('accessToken')
          )}`,
        },
        body: JSON.stringify({ user, message, channel }),
      };
      const response = await fetch('/users/post', config);
      const msgData = await response.json();
      console.log(msgData)

      if (response.ok) {
        
      }
      console.log('response from a server =', msgData);
    } catch (error) {
      console.log(error);
    }

    setMsgInput('');
  };

  const setLoggedOut = async () => {
    console.log('test loggedout =', user);

    console.log({ username: user.user_name })

    try {
      const config = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: user.user_name }),
      };

      const response = await fetch('/users/logout', config);
      // const loggedOutData = await response.json();

      if (response.ok) {
        setAuth(false);
        localStorage.removeItem('accessToken');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleChannels = async () => {
    const response = await fetch(`/users/channel/:${channel}`)
    const data = await response.json()
    console.log(data)
    setMessages(data)
  }

  useEffect(() => {
    handleChannels();
  }, [channel])

  useEffect(() => {
    fetch('/users/getActiveUsers')
      .then((res) => res.json())
      .then((data) => {
        console.log('active users =', data);
        console.log(data)
        setUsers(data.rows);
        console.log(users)
      });

    //handleChannels();
    socket.on('message', (msg) => {
      setMessages((messages) => [msg, ...messages]);
    });

    socket.on('new-login', ({ activeUsers }) => {
      setUsers(activeUsers);
    });

    socket.on('user-leave', ({ activeUsers }) => {
      setUsers(activeUsers);
    });
  }, []);

  const displayMessages = <Messages key={Date.now()} messages={messages} currentUser={user.user_name} />


  const displayActiveUsers =
    users.length >= 1
      ? users.map((user, index) => {
      console.log(user)
      return <li key={index}> {user.name}</li>})
      : null;

  return (
    <> 
    <div className='chat-container mx-auto mt-5'>
      <div className='header'>
        <Navbar>
          <Navbar.Brand>
            <FaSmile />
          </Navbar.Brand>

          <Nav className='ml-auto'>
            <Button onClick={() => setLoggedOut()} variant="outline-light">Log out</Button>
          </Nav>
        </Navbar>
      </div>

      <div className='main d-flex'>
        <div className='chat-sidebar'>
          <div className='mt-2'>
            Channels
          </div> 
          <ul className='pr-2'>
          <Button onClick={() => setChannel('general')} className='mt-2 mb-2 mr-2'> General </Button>
          <Button onClick={() => setChannel('funstuff')} > Fun Stuff </Button>
          </ul>

          <div>
            <FaUsers /> Active Users
          </div>
          <ul>{displayActiveUsers}</ul>
          
        </div>

        <div className='chat-area'> 

        <div className='channel-name'>
          <div>{channel}</div>
        </div>

        <div className='chat-main'>
          <ScrollableFeed>{displayMessages}</ScrollableFeed>
        </div>
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
              variant='outline-light'
              onClick={() => handleClick(msgInput)}
            >
              Send
            </Button>
          </InputGroup.Append>
        </InputGroup>
      </Form>
      <div>{user.user_name}</div>
    </div>
    </>
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
