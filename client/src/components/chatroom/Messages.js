import React, { useEffect, useRef } from 'react';
import Message from './Message';

const Messages = ({ messages, currentUser, currentChannel }) => {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  const channelMessages = messages.filter(
    (message) => message.channel_name === currentChannel
  );

  useEffect(scrollToBottom, [channelMessages]);

  const groups = channelMessages.reduce((groups, message) => {
    const date = message.created_at.split('T')[0];
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(message);
    return groups;
  }, {});

  const groupMessages = Object.keys(groups).map((date) => {
    return {
      date,
      messages: groups[date],
    };
  });

  const displayMessage = groupMessages.map((group) => {
    return (
      <Message
        key={group.date}
        date={group.date}
        messages={group.messages}
        currentUser={currentUser}
      />
    );
  });

  return (
    <div>
      {displayMessage}
      <div ref={messagesEndRef}></div>
    </div>
  );
};

export default Messages;
