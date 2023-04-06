import React from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { redirect } from "react-router-dom";


axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
axios.defaults.withCredentials = true;

const client = axios.create({
  baseURL: "http://127.0.0.1:8000"
});


const RegistFront = (e) => {

    const [currentUser, setCurrentUser] = useState();

    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    function submitRegistration(e) {
        e.preventDefault();
        client.post(
          "/authentication/register",
          {
            email: email,
            username: username,
            password: password
          }
        ).then(function(res) {
          client.post(
            "/authentication/login", 
            {
              email: email,
              password: password
            }
          ).then(function(res) {
            setCurrentUser(true);
            window.location.href = "http://127.0.0.1:3000/";
          });
        });
      }

    return (
            
                <div className="center">
                  <Form onSubmit={e => submitRegistration(e)}>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                      <Form.Label>Email address</Form.Label>
                      <Form.Control type="email" placeholder="Enter email" value={email} onChange={e => setEmail(e.target.value)} />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicUsername">
                      <Form.Label>Username</Form.Label>
                      <Form.Control type="text" placeholder="Enter username" value={username} onChange={e => setUsername(e.target.value)} />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicPassword">
                      <Form.Label>Password</Form.Label>
                      <Form.Control type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
                    </Form.Group>
                    <Button variant="primary" type="submit">
                      Submit
                    </Button>
                  </Form>
                </div>        
              
          
    );
    }

export default RegistFront;