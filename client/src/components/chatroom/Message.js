import React from 'react';
import { Toast } from 'react-bootstrap';

const Message = ({ msg, currentUser }) => {
console.log(currentUser)

  return msg.username === 'chatbot' ? (
    <p className='text-muted'>{msg.message_text}</p>
  ) : msg.user_name === currentUser ? (
    <div className='message'>
      <Toast className='ml-auto mb-0'>
        {' '}
        <Toast.Body>{msg.message_text}</Toast.Body>
      </Toast>
      <div className='text-right'>
        {msg.user_name} {msg.post_time}
      </div>
    </div>
  ) : (
    <div className='message'>
      <Toast className='mr-auto mb-0'>
        {' '}
        <Toast.Body>{msg.message_text}</Toast.Body>
      </Toast>
      <div className='text-left'>
      {msg.user_name} {msg.post_time}
      </div>
    </div>
  );
};

export default Message;
