import React from 'react'
import Message from './Message';

const Messages = ({messages, currentUser}) => {
  console.log(messages, currentUser)

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
  });

  console.log(groupMessages)

  const displayMessage = groupMessages.map(group => {
    console.log(group.messages)
    return <Message key={group.date} date={group.date} messages={group.messages} currentUser={currentUser} />
  })

  return (
    <div>
      {displayMessage}
    </div>
  )
}

export default Messages
