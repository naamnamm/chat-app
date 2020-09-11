import React from 'react';
import { Jumbotron, Container } from 'react-bootstrap';
import './LoginSignup.css';
import Login from './Login';
import Signup from './Signup';

const LoginSignup = ({ handleClick }) => {
  return (
    <div className='jumbotron-container mx-auto mt-5 d-flex'>
      <Container className='login-container mx-5'>
        <Login handleclick={handleClick} />
      </Container>
      <Container className='signup-container'>
        <Signup />
      </Container>
    </div>
  );
};

export default LoginSignup;
