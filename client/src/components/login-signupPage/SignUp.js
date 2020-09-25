import React, { useState, useRef } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';

const SignUp = ({ closeModal }) => {
  const usernameRef = useRef();
  const passwordRef = useRef();
  const [registeredUser, setRegisteredUser] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = {
        username: usernameRef.current.value,
        password: passwordRef.current.value,
      };

      const config = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      };

      const fetchData = await fetch('/users/signup', config);
      const response = await fetchData.json();

      console.log(response);
      console.log(response.data);

      if ('error' in response) {
        setErrorMsg(response.error.message);
      }

      if ('data' in response) {
        closeModal();
        setRegisteredUser(response.data);
      }
    } catch (error) {
      console.log(error);
    }

    console.log(registeredUser);
    console.log(errorMsg);
  };

  return (
    <>
      <Modal.Header closeButton>Create Account</Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group>
            <Form.Label>Username</Form.Label>
            <Form.Control type='text' ref={usernameRef} required />
          </Form.Group>
          <Form.Group>
            <Form.Label>Password</Form.Label>
            <Form.Control type='text' ref={passwordRef} required />
          </Form.Group>
          <Button type='submit'>Sign up</Button>
          {errorMsg ? <div className='text-danger'>{errorMsg}</div> : null}
        </Form>
      </Modal.Body>
    </>
  );
};

export default SignUp;
