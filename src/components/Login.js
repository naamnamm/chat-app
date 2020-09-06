import React from 'react';
import { FaComments } from 'react-icons/fa';
import './Login.css';
import { Button, Card, Form } from 'react-bootstrap';

const login = () => {
  return (
    <div className='card-container'>
      <Card>
        <Card.Header className='font-weight-bold text-muted'>
          Log in to Chat Application
        </Card.Header>

        <Card.Body>
          <Card.Title className='mt-1 mb-4'>
            <FaComments color='skyblue' className='logo-size' />
          </Card.Title>

          <Form.Control
            type='email'
            placeholder='Phone, email or username'
            className='w-75 mx-auto my-3'
          />
          <Form.Control
            type='password'
            placeholder='Password'
            className='w-75 mx-auto my-3'
          />

          {/* <Form inline className='w-75 mx-auto my-3'>
            <Form.Check
              type='checkbox'
              label='Ready to search for tweets?'
              className='text-muted'
            />
          </Form> */}

          <Button className='my-3'>Log in</Button>

          <div>
            <a href='/'> Forgot password?</a> ·
            <a href='/'> Sign up for new account</a>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default login;
