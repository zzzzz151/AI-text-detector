import React from "react";
import { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import axios from "axios";

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
axios.defaults.withCredentials = true;

const client = axios.create({
    baseURL: "http://127.0.0.1:8000"
});

const LoginFront = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    function submitLogin(e) {
        e.preventDefault();
        client.post(
            "/authentication/login",
            {
                email: email,
                password: password
            }
        ).then(function(res) {
            console.log(res);
            window.location.href = "http://127.0.0.1:3000/";
        });
    }



    return (
        <div className="center">
          <Form onSubmit={e => submitLogin(e)}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" placeholder="Enter email" value={email} onChange={e => setEmail(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
            </Form.Group>
            <div>
                <Link to="/registFront">Doesn't have an account. Register Now</Link>
            </div>
            <Button className="mt-3" variant="primary" type="submit">
              Submit
            </Button>
          </Form>
        </div>
    );
    }

export default LoginFront;