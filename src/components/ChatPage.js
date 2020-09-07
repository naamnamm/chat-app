import React from 'react';
import { Card, Container, InputGroup, FormControl } from 'react-bootstrap';
import './ChatPage.css';
import userLogo from '../images/mock-user-image.png';
import { FaSearch } from 'react-icons/fa';
// import { Link } from 'react-router-dom';

const chat = () => {
  return (
    <Container className='mt-5'>
      <div className='contacts-container'>
        <p className='text-left'>Chat</p>

        <InputGroup className='mb-3 input-wrapper'>
          <FormControl
            placeholder='Search Chat'
            aria-label='Amount (to the nearest dollar)'
          />
          <InputGroup.Append>
            <InputGroup.Text>
              <FaSearch color='grey' className='search-icon' />
            </InputGroup.Text>
          </InputGroup.Append>
        </InputGroup>

        <Card>
          {/* <Link to='/batch/list'> */}
          <div onClick={() => alert('Hello from here')} className='mx-auto'>
            <Card className='d-flex flex-row card-hoverable' hoverable>
              <Card.Img variant='left' src={userLogo} className='user-logo ' />
              <Card body>some text within a card body.</Card>
            </Card>
          </div>
          {/* </Link> */}
          <Card body>This is some text within a card body.</Card>
          <Card body>This is some text within a card body.</Card>
        </Card>
      </div>
    </Container>
  );
};

export default chat;

//link
//
//https://stackoverflow.com/questions/19285640/font-awesome-icon-inside-text-input-element
