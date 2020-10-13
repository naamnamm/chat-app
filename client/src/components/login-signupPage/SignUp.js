import React, { useState, useRef } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';

const SignUp = ({ closeModal }) => {
  const usernameRef = useRef();
  const passwordRef = useRef();
  //const [registeredUser, setRegisteredUser] = useState([]);
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

      const response = await fetch('/users/signup', config);
      console.log(response);
      const signupData = await response.json();
      console.log(signupData);

      !response.ok ? setErrorMsg(signupData.error.message) : closeModal();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Modal.Header closeButton>Create Account</Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          {errorMsg ? <div className='text-danger'>{errorMsg}</div> : null}
          {/* {https://react-bootstrap.github.io/components/alerts/} */}
          <Form.Group>
            <Form.Label>Username</Form.Label>
            <Form.Control type='text' ref={usernameRef} required />
          </Form.Group>
          <Form.Group>
            <Form.Label>Password</Form.Label>
            <Form.Control type='text' ref={passwordRef} required />
          </Form.Group>
          <Button type='submit'>Sign up</Button>
        </Form>
      </Modal.Body>
    </>
  );
};

export default SignUp;
