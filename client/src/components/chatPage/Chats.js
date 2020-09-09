import React from 'react';
import { Card, Toast, InputGroup, FormControl } from 'react-bootstrap';
import './ChatPage.css';
import userLogo from '../../images/mock-user-image.png';

const Chats = () => {
  return (
    <div>
      <Card className='d-flex flex-row title-container'>
        <Card.Img variant='left' src={userLogo} className='user-logo ' />
        <Card body className='border-light'>
          Name
        </Card>
      </Card>

      <div className='chat-background' aria-live='polite' aria-atomic='true'>
        <div className='chat-toast-me'>
          <Toast>
            <Toast.Header>
              <img
                src='holder.js/20x20?text=%20'
                className='rounded mr-2'
                alt=''
              />
              <strong className='mr-auto'>Bootstrap</strong>
              <small>just now</small>
            </Toast.Header>
            <Toast.Body>See? Just like this.</Toast.Body>
          </Toast>
          <Toast>
            <Toast.Header>
              <img
                src='holder.js/20x20?text=%20'
                className='rounded mr-2'
                alt=''
              />
              <strong className='mr-auto'>Bootstrap</strong>
              <small>2 seconds ago</small>
            </Toast.Header>
            <Toast.Body>Heads up, toasts will stack automatically</Toast.Body>
          </Toast>
        </div>

        <div className='chat-toast-you'>
          <Toast>
            <Toast.Header>
              <img
                src='holder.js/20x20?text=%20'
                className='rounded mr-2'
                alt=''
              />
              <strong className='mr-auto'>Bootstrap</strong>
              <small>just now</small>
            </Toast.Header>
            <Toast.Body>See? Just like this.</Toast.Body>
          </Toast>
          <Toast>
            <Toast.Header>
              <img
                src='holder.js/20x20?text=%20'
                className='rounded mr-2'
                alt=''
              />
              <strong className='mr-auto'>Bootstrap</strong>
              <small>2 seconds ago</small>
            </Toast.Header>
            <Toast.Body>Heads up, toasts will stack automatically</Toast.Body>
          </Toast>
        </div>
      </div>

      <InputGroup className='mb-3 input-wrapper'>
        <FormControl placeholder='Type a message...' aria-label='text' />
      </InputGroup>
    </div>
  );
};

export default Chats;
