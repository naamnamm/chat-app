import React from 'react';
import { Button, Card, Navbar, Nav, Form } from 'react-bootstrap';
import './ChatRoom.css';
import { FaSmile } from 'react-icons/fa';

const Chatroom = () => {
  return (
    <div className='chat-container mx-auto mt-5'>
      <div className='header d-flex'>
        <Navbar>
          <Navbar.Brand>
            <FaSmile />
          </Navbar.Brand>

          <Nav className='ml-auto'>
            {' '}
            <Button>Leave Room</Button>
          </Nav>
        </Navbar>
      </div>

      <div className='main d-flex'>
        <div className='main-users'></div>

        <div className='main-chat'></div>
      </div>

      <Form.Group className='input-msg'>
        <Form.Control type='text' placeholder='Enter email' />
      </Form.Group>
    </div>
  );
};

export default Chatroom;
