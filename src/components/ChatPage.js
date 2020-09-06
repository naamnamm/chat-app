import React from 'react';
import { Card, Container, InputGroup, FormControl } from 'react-bootstrap';
import './ChatPage.css';
import userLogo from '../images/mock-user-image.png';

const chat = () => {
  return (
    <Container className='mt-5'>
      <div className='contacts-container'>
        <p className='text-left'>Chat</p>
        <InputGroup className='mb-3'>
          <FormControl
            placeholder='Search Chat'
            aria-label='Amount (to the nearest dollar)'
          />
        </InputGroup>
        <Card>
          <Card className='d-flex flex-row mx-auto'>
            <Card.Img variant='left' src={userLogo} className='user-logo ' />
            <Card body>some text within a card body.</Card>
          </Card>
          <Card body>This is some text within a card body.</Card>
          <Card body>This is some text within a card body.</Card>
        </Card>
      </div>
    </Container>
  );
};

export default chat;
