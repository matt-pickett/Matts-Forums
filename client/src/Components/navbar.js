import React, { useState, useEffect } from "react";
import 'bootstrap/dist/js/bootstrap.bundle.min';
import 'bootstrap/dist/js/bootstrap.js';
import 'bootstrap/dist/css/bootstrap.css';
import { NavLink } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { LoginButton } from "./buttons/loginButton";
import { SignupButton } from "./buttons/signupButton"; 
import { LogoutButton } from "./buttons/logoutButton";

export default function Navbar() {
  const { isAuthenticated, user } = useAuth0();
  const [expanded, setExpanded] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);


  const toggleNavbar = () => {
    setExpanded(!expanded);
  };
  useEffect(() => {
      function handleResize() {
        if (window.innerWidth < 992) {
          setIsSmallScreen(true);
        }
        else {
          setIsSmallScreen(false);
        }
      }
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-info bg-secondary fixed-top">
        <h1 style={{position: "absolute", left: "50%", top: "40px",transform: "translate(-50%, -50%)"}}>
              Matt's Posts
        </h1>
        <button
          className="navbar-toggler"
          type="button"
          onClick={toggleNavbar}
          aria-controls="navbarSupportedContent"
          aria-expanded={expanded}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className={`collapse navbar-collapse ${expanded && isSmallScreen ? 'show' : ''}`} id="navbarSupportedContent">
          <ul className={`navbar-nav  justify-content-between w-100 ${expanded && isSmallScreen ? '' : 'align-items-center'}`}>
            <li className={`nav-item p-2 ${expanded && isSmallScreen ? 'ms-0' : 'ms-3'}`}>
              <button
                className={`nav-link p-2 btn btn-dark text-light `}
                onClick={() => window.location.href = '/'}
              >
                Home
              </button>
            </li>
            
            <li className={`nav-item p-2 me-3 d-flex ${expanded && isSmallScreen ? 'flex-column align-items-start ' : 'align-items-center '}`}>
              {!isAuthenticated && (
                <>
                  <div className={`${expanded && isSmallScreen ? 'me-0' : 'me-3'}`}>
                    <SignupButton />
                  </div>
                  <LoginButton />
                </>
              )}
              {isAuthenticated && (
                <div className={`d-flex ${expanded && isSmallScreen ? 'flex-column' : ''}`}>
                  <LogoutButton />
                  <NavLink className={`nav-link p-0 ${expanded && isSmallScreen ? 'ms-0 pt-3' : 'ms-3'}`} to="/profile">
                    <img
                      src={user.picture}
                      alt="Profile"
                      style={{ width: '48px', borderRadius: '50%'}}
                    />
                  </NavLink>
                </div>
              )}
            </li>
          </ul>
        </div>
      </nav>
    </div>
  );
}
