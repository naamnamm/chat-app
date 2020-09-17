import React, { useRef } from 'react';
import { Container, Card, Form, Button } from 'react-bootstrap';
import './LoginSignup.css';
import { FaComments } from 'react-icons/fa';

const LoginSignup = ({ onUsernameSubmit, handleLoggedin }) => {
  const usernameRef = useRef();

  const handleClick = () => {
    onUsernameSubmit(usernameRef.current.value);

    handleLoggedin(true);
  };

  return (
    <div className='jumbotron-container mx-auto mt-5 d-flex'>
      <Container className='login-container mx-5'>
        <Card.Body>
          <h3 className='mt-1 mb-4 text-color'> Log in to Chat Room</h3>
          <Card.Title className='mt-1 mb-4'>
            <FaComments className='logo-size' />
          </Card.Title>

          <Form.Control
            type='text'
            placeholder='Username'
            className='w-75 mx-auto my-3'
            ref={usernameRef}
            required
          />
          <Form.Control
            type='password'
            placeholder='Password'
            className='w-75 mx-auto my-3'
          />

          <Button
            onClick={handleClick}
            className='my-3 button-color border-light'
          >
            Log in
          </Button>

          <div>
            <a href='/'> Forgot password?</a>
          </div>
        </Card.Body>
      </Container>

      <Container className='signup-container'>
        <h3 className='mt-5'>Hello, Friend!</h3>

        <h5 className='mt-4'>Join us today</h5>

        <Button variant='outline-light' className='mt-4 '>
          Sign up
        </Button>
      </Container>
    </div>
  );
};

export default LoginSignup;
