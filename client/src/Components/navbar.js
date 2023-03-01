import React from "react";
 
import "bootstrap/dist/css/bootstrap.css";
 
import { NavLink } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { LoginButton } from "./buttons/loginButton";
import { SignupButton } from "./buttons/signupButton"; 
import { LogoutButton } from "./buttons/logoutButton";

export default function Navbar() {
 const { isAuthenticated, user } = useAuth0();
 return (
   <div>
     <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
       <button
         className="navbar-toggler"
         type="button"
         data-toggle="collapse"
         data-target="#navbarSupportedContent"
         aria-controls="navbarSupportedContent"
         aria-expanded="false"
         aria-label="Toggle navigation"
       >
         <span className="navbar-toggler-icon"></span>
       </button>
 
       <div className="collapse navbar-collapse" id="navbarSupportedContent">
         <ul className="navbar-nav justify-content-between w-100">
          <li className="nav-item p-2 ms-3">
            <NavLink className="nav-link text-light p-0" to="/">
              Home
            </NavLink>
          </li>
          <li className="nav-item p-2 me-3 d-flex align-items-center">
             {!isAuthenticated && (
              <>
                <SignupButton />
                <LoginButton />
              </>
            )}
            {isAuthenticated && (
              <>
                <LogoutButton />
                <NavLink className="nav-link p-0 ms-3" to="/profile">
                  <img
                    src={user.picture}
                    alt="Profile"
                    style={{ width: '48px', borderRadius: '50%'}}
                  />
                </NavLink>
              </>
            )}
          </li>
         </ul>
       </div>
     </nav>
   </div>
 );
}