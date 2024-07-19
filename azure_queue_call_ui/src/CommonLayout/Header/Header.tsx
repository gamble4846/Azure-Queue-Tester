import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import "./Header.css";

const Navbar = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(location.pathname);

  const handleTabClick = (tab: React.SetStateAction<string>) => {
    setActiveTab(tab);
  };

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
      <div className="container-fluid">
        <a className="navbar-brand" href="#">Azure Queue Call UI</a>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link
                to="/"
                className={`nav-link ${activeTab === '/' ? 'active' : ''}`}
                onClick={() => handleTabClick('/')}
              >
                Client Data
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/message"
                className={`nav-link ${activeTab === '/message' ? 'active' : ''}`}
                onClick={() => handleTabClick('/message')}
              >
                Message
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/queue"
                className={`nav-link ${activeTab === '/queue' ? 'active' : ''}`}
                onClick={() => handleTabClick('/queue')}
              >
                Queue
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/sendMessage"
                className={`nav-link ${activeTab === '/sendMessage' ? 'active' : ''}`}
                onClick={() => handleTabClick('/sendMessage')}
              >
                Send Message
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
