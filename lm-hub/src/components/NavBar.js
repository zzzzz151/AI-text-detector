import { useState, useRef } from "react";
import { NavLink } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import axios from "axios";
import FormLabel from "react-bootstrap/esm/FormLabel";


axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
axios.defaults.withCredentials = true;

const client = axios.create({
  baseURL: "http://127.0.0.1:8000"
});

function NavBar( props ) {
    const [navbar, setNavbar] = useState(false);    
    const [selectedOption, setSelectedOption] = useState(null);
    const [showLinkInput, setShowLinkInput] = useState(false);
    const [showScriptInput, setShowScriptInput] = useState(false);
    const [file, setFile] = useState(null);
    const fileInputRef = useRef(null);
    const username = props.Username;

    const currentUser = props.isLogged;

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [type, setType] = useState('url');
    const [url, setUrl] = useState('');
    const [scriptFile, setScriptFile] = useState(null);

    const handleNameChange = (event) => {
        setName(event.target.value);
    };

    const handleDescriptionChange = (event) => {
        setDescription(event.target.value);
    };

    const handleTypeChange = (event) => {
        setType(event.target.value);
    };

    const handleUrlChange = (event) => {
        setUrl(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append('name', name);
        formData.append('username', username);
        formData.append('description', description);
        formData.append('type', type);
        {/* if type url append url, elif type scrypt, append script */}
        if (type === 'url') {
            formData.append('url', url);
        } else if (type === 'script') {
            formData.append('script', scriptFile);
        }
        client.post("/api/v1/uploadLM",{ 
            body: formData,
            method : 'post',
         }, {withCredentials: true})
        .then(function(res) {
            console.log(res);
        })
        .catch(function(error) {
            console.log(error);
        });

    };

    const handleLogout = async () => {
        client.post(
            "/authentication/logout",
            {withCredentials: true}
          ).then((response) => {
            window.location.reload();
            });
    }
      

    function handleFileChange(event) {
        setFile(event.target.files[0]);
        console.log(event.target.files[0]);
      }
    
    const handleOptionChange = (event) => {
        setSelectedOption(event.target.value);
        setShowLinkInput(event.target.value === 'link');
        setShowScriptInput(event.target.value === 'script');
    }
    
    const handleNextButtonClick = () => {
        // Handle "Next" button click if necessary
    }

    const handleBrowseButtonClick = () => {
        fileInputRef.current.click();
    }

    return (
        
        <div className="navbar bg-base-100 border-slate-400">
            <div className="navbar-start">
                <div className="dropdown">
                <label tabIndex={0} className="btn btn-ghost btn-circle">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" /></svg>
                </label>
                <ul tabIndex={0} className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52">
                    <li><a>Homepage</a></li>
                    <li><a>Portfolio</a></li>
                    <li><a>About</a></li>
                </ul>
                </div>
            </div>
            <div className="navbar-center">
                <a className="btn btn-ghost normal-case text-xl">Language Model Hub</a>
            </div>
            {/* if currentuser */}
            {currentUser ? (
                <div className="navbar-end">
                    {/* The button to open modal */}
                    <label htmlFor="my-modal" className="btn btn-outline btn-primary ">Add Language Model</label>

                    {/* Put this part before </body> tag */}
                    <input type="checkbox" id="my-modal" className="modal-toggle" />
                    <div className="modal pr-3">
                        <div className="modal-box">
                            <h3 className="font-bold text-lg">Add Language Modal</h3>
                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-3" controlId="formName">
                                    <Form.Label>LM Name</Form.Label>
                                    <Form.Control type="text" placeholder="Enter LM Name" value={name} onChange={handleNameChange} />                                
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="formDescription">
                                    <Form.Label>LM Description</Form.Label>
                                    <Form.Control type="text" placeholder="Enter LM Description" value={description} onChange={handleDescriptionChange} />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="formType">
                                    <Form.Label>LM Type</Form.Label>
                                    <Form.Select aria-label="Default select example" value={type} onChange={handleTypeChange}>
                                        <option value="url">API url</option>
                                        <option value="script">Script</option>
                                    </Form.Select>
                                </Form.Group>
                                {type === 'url' && (
                                    <Form.Group className="mb-3" controlId="formUrl">
                                        <Form.Label>LM Url</Form.Label>
                                        <Form.Control type="text" placeholder="Enter LM Url" value={url} onChange={handleUrlChange} />
                                    </Form.Group>
                                )}
                                {type === 'script' && (
                                    <Form.Group className="mb-3" controlId="formScriptFile">
                                        <Form.Label>LM Script File</Form.Label>
                                        <Form.Control type="file" name="file" placeholder="Enter LM Script File" onChange={handleFileChange} />
                                    </Form.Group>
                                )}   
                                <button type="submit">Submit</button>
                            </Form>
                        </div>
                    </div>
                    <button type="button" className="btn btn-primary ml-5" onClick={handleLogout}> Logout </button>
                    <button className="btn btn-ghost btn-circle">
                    <div className="indicator">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" stroke-linecap="round" stroke-linejoin="round" /></svg>
                    </div>
                    </button>
                </div>
            ) : ( 
                <div className="navbar-end">
                    <button className="btn btn-primary btn-sm mr-10"><NavLink to="/registFront">Register</NavLink></button>
                    <button className="btn btn-primary btn-sm mr-5"><NavLink to="/loginFront" >Login</NavLink></button>
                </div>
            )}
        </div>
    );
}

export default NavBar;

