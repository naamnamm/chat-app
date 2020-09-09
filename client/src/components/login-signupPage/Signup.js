import React from 'react';
import { Container, Button } from 'react-bootstrap';

const Signup = () => {
  return (
    <Container className='mt-5'>
      <h3>Hello, Friend!</h3>

      <h5 className='mt-4'>Join us today</h5>

      <Button variant='outline-light' className='mt-4 '>
        Sign up
      </Button>
    </Container>
  );
};

export default Signup;
