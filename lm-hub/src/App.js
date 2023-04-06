import React from 'react' 
import axios from 'axios';
import { useState, useEffect } from 'react';
import NavBar from './components/NavBar'
import LMCard from './components/LMCard'
import Footer from './components/Footer'

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
axios.defaults.withCredentials = true;

const client = axios.create({
  baseURL: "http://127.0.0.1:8000"
});

function App() {

  const [username, setUsername] = useState();
  const [currentUser, setCurrentUser] = useState();
  useEffect(() => {
    client.get("/authentication/user")
    .then(function(res) {
      setCurrentUser(true);
      setUsername(res.data.username);
    })
    .catch(function(error) {
      setCurrentUser(false);
    });
  }, []);

  return (
    <>
      <NavBar isLogged = {currentUser} Username = {username}/>
      <div className="bg-slate-400 h-full pt-10">
        <div className="p-8 justify-items-center ">
          <LMCard score={100} />
        </div>
        <div className="p-8 justify-items-center ">
          <LMCard score={75} />
        </div>
        <div className="p-8 justify-items-center ">
          <LMCard score={50} />
        </div>
        <div className="p-8 justify-items-center ">
          <LMCard score={25} />
        </div>
      </div>
      <Footer />
      

      
    </>
    
  )
}


export default App;