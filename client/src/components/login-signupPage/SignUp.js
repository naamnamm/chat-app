import React, { useRef } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';

const SignUp = ({ closeModal }) => {
  const usernameRef = useRef();
  const passwordRef = useRef();

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log(usernameRef.current.value, passwordRef.current.value);
    closeModal();
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
        </Form>
      </Modal.Body>
    </>
  );
};

export default SignUp;
