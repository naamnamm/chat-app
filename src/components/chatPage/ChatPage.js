import React from 'react';
import { Container } from 'react-bootstrap';
import './ChatPage.css';
import Contacts from './Contacts';
import Chats from './Chats';

// import { Link } from 'react-router-dom';

const chat = () => {
  return (
    <div className='main-container mt-5 mx-auto d-flex'>
      <Contacts />
      <Chats />
    </div>
  );
};

export default chat;

//link
//https://stackoverflow.com/questions/52280874/how-to-make-card-component-clickable
//https://stackoverflow.com/questions/19285640/font-awesome-icon-inside-text-input-element
