import { useState, useRef } from "react";

function NavBar() {
    const [navbar, setNavbar] = useState(false);    
    const [selectedOption, setSelectedOption] = useState(null);
    const [showLinkInput, setShowLinkInput] = useState(false);
    const [showScriptInput, setShowScriptInput] = useState(false);
    const [file, setFile] = useState(null);
    const fileInputRef = useRef(null);

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
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
            <div className="navbar-end">
                {/* The button to open modal */}
                <label htmlFor="my-modal" className="btn btn-outline btn-primary">Add Language Model</label>

                {/* Put this part before </body> tag */}
                <input type="checkbox" id="my-modal" className="modal-toggle" />
                <div className="modal pr-3">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg">Add Language Modal</h3>
                        <div className="form-control w-full max-w-xs">
                            <label className="label">
                                <span className="label-text">Language Model Name</span>
                            </label>
                            <input type="text" placeholder="Type here" className="input input-bordered w-full max-w-xs" />
                            <label className="label">
                            </label>
                        </div>
                        <div className="form-control w-full max-w-xs pb-5">
                            <label className="label">
                                <span className="label-text">Description</span>
                            </label>
                            <input type="text" placeholder="Type here" className="input input-bordered w-full max-w-xs" />
                            <label className="label">
                            </label>
                        </div>
                        <label htmlFor="option-select">Language Model Type:</label>
                        <select className=" select w-full max-w-xs" id="option-select" value={selectedOption} onChange={handleOptionChange}>
                            <option value="">-- Select an option --</option>
                            <option value="link">API Link</option>
                            <option value="script">Python script</option>
                        </select>
                        
                        {showLinkInput && (
                            <div className="pb-5 pt-5">
                                <input type="text" placeholder="API Link" className="input input-bordered w-full max-w-xs" />
                            </div>
                        )}
                        
                        {showScriptInput && (
                            <div className="pt-5">
                                <label htmlFor="script-input">Script:</label>
                                <div>
                                    <input type="file" id="script-input" accept=".py" onChange={handleFileChange} ref={fileInputRef} />
                                    <label htmlFor="script-input" className="button" onClick={handleBrowseButtonClick}></label>
                                    {file && <span>{file.name}</span>}
                                </div>
                            </div>
                        )}
                        <div className="modal-action">
                            <label htmlFor="my-modal" className="btn">Add!</label>
                        </div>
                    </div>
                </div>
                <button className="btn btn-ghost btn-circle">
                <svg className="h-8 w-8" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" stroke-linecap="round" stroke-linejoin="round"></path>
                </svg>                
                </button>
                <button className="btn btn-ghost btn-circle">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                </button>
                <button className="btn btn-ghost btn-circle">
                <div className="indicator">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" stroke-linecap="round" stroke-linejoin="round" /></svg>
                </div>
                </button>
            </div>
        </div>
    );
}

export default NavBar;

