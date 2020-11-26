import React from 'react'
import './Msg.css';

const Msg = ({date, messages, currentUser}) => {
  console.log(date, messages, currentUser)

  const displayMsg = messages.map(msg => {
    console.log(msg.message_text)
    //debugger;
    return msg.user_name == currentUser ? 
    (<div className="messageContainer ml-auto mb-0">
        <div className="messageBox backgroundBlue">
          <p className="messageText colorWhite">{msg.text}</p>
        </div>
          <p className="sentText pl-10">{msg.user_name}</p>
      </div>
    ) : (
      <div className="messageContainer">
        <p className="sentText pr-10">{msg.user_name}</p>
        <div className="messageBox backgroundLight mr-auto mb-0">
          <p className="messageText colorDark">{msg.text}</p>
        </div> 
      </div>)
      ;
  })
  
  return (
    <div>
      <hr></hr>
      <div className="date-box">{date}</div> 
      <div>{displayMsg}</div>

    </div>
  )
}

export default Msg
