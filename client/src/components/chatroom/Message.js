import React from 'react';
import './Message.css';

const Message = ({ date, messages, currentUser }) => {
  const displayMsg = messages.map((msg) => {
    return msg.username == currentUser ? (
      <div className='messageContainer ml-auto mb-0' key={msg.id}>
        <div className='messageBox backgroundBlue'>
          <p className='messageText colorWhite'>{msg.text}</p>
        </div>
        <p className='sentText pl-10'>{msg.username}</p>
      </div>
    ) : (
      <div className='messageContainer' key={msg.id}>
        <p className='sentText pr-10'>{msg.username}</p>
        <div className='messageBox backgroundLight mr-auto mb-0'>
          <p className='messageText colorDark'>{msg.text}</p>
        </div>
      </div>
    );
  });

  return (
    <div>
      <hr></hr>
      <div className='date-box mb-2'>{date}</div>
      <div>{displayMsg}</div>
    </div>
  );
};

export default Message;
