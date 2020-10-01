import React from 'react';
import { Toast } from 'react-bootstrap';

const Message = ({ msg, currentUser }) => {
  return msg.username === 'chatbot' ? (
    <p className='text-muted'>{msg.text}</p>
  ) : msg.username === currentUser ? (
    <div className='message'>
      <Toast className='ml-auto mb-0'>
        {' '}
        <Toast.Body>{msg.text}</Toast.Body>
      </Toast>
      <div className='text-right'>
        {msg.username} {msg.time}
      </div>
    </div>
  ) : (
    <div className='message'>
      <Toast className='mr-auto mb-0'>
        {' '}
        <Toast.Body>{msg.text}</Toast.Body>
      </Toast>
      <div className='text-left'>
        {msg.username} {msg.time}
      </div>
    </div>
  );
};

export default Message;
