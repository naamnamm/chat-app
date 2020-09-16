import React, { useState, useEffect } from 'react';
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

const socket = io('http://localhost:5000/');

const Chatroom = ({ username }) => {
  const [messages, setMessages] = useState([]);
  const [msgInput, setMsgInput] = useState('');
  const [user, setUser] = useState([]);

  const handleChange = (e) => {
    setMsgInput(e.target.value);
  };

  const handleClick = (msgInput) => {
    //emit msg to server
    socket.emit('chatMsg', msgInput);

    //
    //then set MsgInput to ''
    setMsgInput('');
  };

  useEffect(() => {
    socket.on('msg', (msg) => {
      setMessages((messages) => [...messages, msg]);
    });

    console.log(messages);
  }, []);

  const displayMsgs = messages.map((msg, index) => (
    <div key={index} className='message'>
      <Toast className='mr-auto mb-0'>
        {' '}
        <Toast.Body>{msg}</Toast.Body>
      </Toast>
    </div>
  ));

  return (
    <div className='chat-container mx-auto mt-5'>
      <div className='header'>
        <Navbar>
          <Navbar.Brand>
            <FaSmile />
          </Navbar.Brand>

          <Nav className='ml-auto'>
            <Button>Leave Room</Button>
          </Nav>
        </Navbar>
      </div>

      <div className='main d-flex'>
        <div className='chat-sidebar'>
          <div>
            <FaUsers /> Active Users
          </div>
          <ul>
            <li>Naam</li>
            <li>Ben</li>
          </ul>
        </div>

        <div className='chat-main'>
          <div className='text-center font-weight-bold'>Today</div>

          <div className='text-muted'>Naam has joined</div>
          {displayMsgs}
        </div>
      </div>

      <Form className='input-msg'>
        <InputGroup className='py-2 px-5'>
          <FormControl
            placeholder='Write a message...'
            onChange={(e) => handleChange(e)}
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
