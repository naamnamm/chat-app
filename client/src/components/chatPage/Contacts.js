import React from 'react';
import { Card, InputGroup, FormControl } from 'react-bootstrap';
import './ChatPage.css';
import userLogo from '../../images/mock-user-image.png';
import { FaSearch, FaEdit, FaTrashAlt } from 'react-icons/fa';

const Contacts = () => {
  return (
    <div>
      <div className='contacts-container'>
        <div className='d-flex flex-row my-2'>
          <h3 className='text-left mt-1'>Chat</h3>
          <div className='ml-auto mr-2 mt-2'>
            <FaEdit className='mr-2' />
            <FaTrashAlt />
          </div>
        </div>

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
          <div
            onClick={() => alert('Hello from here')}
            className='mx-auto my-1'
          >
            <Card className='d-flex flex-row card-hoverable' hoverable>
              <Card.Img variant='left' src={userLogo} className='user-logo ' />
              <Card body className='border-light'>
                Name
              </Card>
            </Card>
          </div>

          <Card body>This is some text within a card body.</Card>
          <Card body>This is some text within a card body.</Card>
        </Card>
      </div>
    </div>
  );
};

export default Contacts;
