import React from 'react';
import { FaComments } from 'react-icons/fa';
import './Login.css';
import { Button, Card, Form, Container } from 'react-bootstrap';

const Login = ({ handleClick }) => {
  return (
    <div className='card-container'>
      <Container>
        <Card.Body>
          <h3 className='mt-1 mb-4 text-color'> Log in to Chat Room</h3>
          <Card.Title className='mt-1 mb-4'>
            <FaComments className='logo-size' />
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

          <Button
            onClick={(e) => handleClick(e)}
            className='my-3 button-color border-light'
          >
            Log in
          </Button>

          <div>
            <a href='/'> Forgot password?</a>
          </div>
        </Card.Body>
      </Container>
    </div>
  );
};

export default Login;
