import React from 'react';
import {
  Button,
  Toast,
  Navbar,
  Nav,
  InputGroup,
  FormControl,
} from 'react-bootstrap';
import './ChatRoom.css';
import { FaSmile, FaUsers } from 'react-icons/fa';

const Chatroom = () => {
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
            <FaUsers /> Users
          </div>
          <ul>
            <li>Naam</li>
            <li>Ben</li>
          </ul>
        </div>

        <div className='chat-main'>
          <div className='text-center font-weight-bold'>Today</div>

          <div className='text-muted text-it'>Naam has joined</div>
          <Toast className='ml-auto mb-0'>
            {' '}
            <Toast.Body>Hello, world! This is a toast message.</Toast.Body>
          </Toast>
          <div className='text-right'>Naam 8:30 am</div>

          <div className='text-muted text-it'>Ben has joined</div>
          <Toast className='mr-auto mb-0'>
            {' '}
            <Toast.Body>Hello, world! This is a toast message.</Toast.Body>
          </Toast>
          <div className='text-left'>Ben 8:32 am</div>
        </div>
      </div>

      <div className='input-msg'>
        <InputGroup className='py-2 px-5'>
          <FormControl
            placeholder='Write a message...'
            aria-label="Recipient's username"
            aria-describedby='basic-addon2'
          />
          <InputGroup.Append>
            <Button variant='outline-secondary'>Send</Button>
          </InputGroup.Append>
        </InputGroup>
      </div>
    </div>
  );
};

export default Chatroom;
