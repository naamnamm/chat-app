import React, { useState, useRef, useEffect } from 'react';
import { Container, Card, Form, Button, Modal } from 'react-bootstrap';
import './LoginSignup.css';
import { FaComments } from 'react-icons/fa';
import SignUp from './SignUp';

const LoginSignup = ({ onUserSubmit, setAuth }) => {
  const usernameRef = useRef();
  const passwordRef = useRef();
  const [modalOpen, setModalOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const closeModal = () => {
    setModalOpen(false);
  };

  const handleLogIn = async () => {
    try {
      const data = {
        username: usernameRef.current.value.toLowerCase(),
        password: passwordRef.current.value,
      };

      const config = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      };

      const response = await fetch('/users/login', config);
      const loginData = await response.json();

      if (!response.ok) {
        setErrorMsg(loginData.error.message);
      } else {
        localStorage.setItem('accessToken', JSON.stringify(loginData.token));
        onUserSubmit(loginData);
        setAuth(true);
      }
    } catch (error) {
      console.log(error);
    }
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
            ref={passwordRef}
            required
          />

          <Button
            onClick={handleLogIn}
            className='my-3 button-color border-light'
          >
            Log in
          </Button>

          <div>
            <a href='/'> Forgot password?</a>
          </div>

          {errorMsg ? <div className='text-danger'>{errorMsg}</div> : null}
        </Card.Body>
      </Container>

      <Container className='signup-container'>
        <h3 className='mt-5'>Hello, Friend!</h3>

        <h5 className='mt-4'>Join us today</h5>

        <Button
          onClick={() => setModalOpen(true)}
          variant='outline-light'
          className='mt-4 '
        >
          Sign up
        </Button>

        <Modal show={modalOpen} onHide={closeModal}>
          {modalOpen === true ? <SignUp closeModal={closeModal} /> : null}
        </Modal>
      </Container>
    </div>
  );
};

export default LoginSignup;
