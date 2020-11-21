import React from 'react'
import './Msg.css';

const Msg = ({date, messages, currentUser}) => {
  console.log(date, messages, currentUser)

  const displayMsg = messages.map(msg => {
    console.log(msg.message_text)
    //debugger;
    return msg.user_name == currentUser ? (
    <div className="messageContainer">
      <p className="sentText pr-10">{msg.user_name}</p>
      <div className="messageBox backgroundBlue mr-auto mb-0">
        <p className="messageText colorWhite">{msg.message_text}</p>
      </div> 
    </div>)
    : (<div className="messageContainer ml-auto mb-0">
        <div className="messageBox backgroundLight">
          <p className="messageText colorDark">{msg.message_text}</p>
        </div>
          <p className="sentText pl-10">{msg.user_name}</p>
      </div>
    );
  })
  
  return (
    <div>
      <h1>{date}</h1>
      <div>{displayMsg}</div>

    </div>
  )
}

export default Msg