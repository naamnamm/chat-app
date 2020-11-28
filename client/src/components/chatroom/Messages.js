import React, { useEffect, useRef } from 'react'
import Message from './Message';

const Messages = ({messages, currentUser}) => {
  console.log(messages, currentUser)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(scrollToBottom, [messages]);
  
  // this gives an object with dates as keys
  const groups = messages.reduce((groups, message) => {
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
      messages: groups[date]
    };
  }).sort().reverse();

  console.log(groupMessages)

  const displayMessage = groupMessages.map(group => {
    console.log(group.messages)
    return <Message key={group.date} date={group.date} messages={group.messages} currentUser={currentUser} />
  })

  return (
    <div>
      {displayMessage}
      <div ref={messagesEndRef}></div>
    </div>
  )
}

export default Messages
