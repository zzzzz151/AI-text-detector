import React, { useState } from 'react';
import axios from 'axios';

function LoginTest() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    axios.post('http://127.0.0.1:8000/authentication/login/', {
      email: username,
      password: password
    }, { withCredentials: true })
      .then((res) => {
        console.log(res);
        document.cookie = `sessionid=${res.data.sessionid}; path=/;`;
        // set state or redirect to a new page
      })
      .catch((err) => {
        console.error(err);
      });
  };
  

  return (
    <form onSubmit={handleFormSubmit}>
      <label>
        Username:
        <input type="text" value={username} onChange={handleUsernameChange} />
      </label>
      <br />
      <label>
        Password:
        <input type="password" value={password} onChange={handlePasswordChange} />
      </label>
      <br />
      <button type="submit">Login</button>
    </form>
  );
}

export default LoginTest;