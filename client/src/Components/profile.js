import { useAuth0 } from "@auth0/auth0-react";
import React, { useState, useEffect } from "react";
import { GetLastUpdate } from "./getDate";
export const ProfilePage = () => {
  const { user, getAccessTokenSilently  } = useAuth0();

  useEffect(() => {
    // Get the JWT token from Auth0 when the component mounts
    const getAccessToken = async () => {
      const accessToken = await getAccessTokenSilently();
    };

    if (user) {
      getAccessToken();
    }
  }, [user, getAccessTokenSilently]);

  if (!user) {
    return <div>Please log in to view your profile.</div>;
  }

  const VerifiedEmail = (props) => {
    const isVerified = props.verified ? "Yes" : "No";
    return (
      <div className="profile__value">Email verified: {isVerified}</div>
    );
  }

  return (
      <div className="d-flex flex-column align-items-center justify-content-center" style={{ height: "100vh" }}>
        <h1>
          Profile Page
        </h1>
        <div>
            <div>
              <img
                src={user.picture}
                alt="Profile"
                className="profile__avatar"
              />
              <div>
                <h2>{user.name}</h2>
                <span>{user.email}</span>
              </div>
            </div>
            <div>
                <div>
                    <span>Last updated: </span>
                    <GetLastUpdate time={user.updated_at}></GetLastUpdate>
                </div>            
                <VerifiedEmail verified={user.email_verified}></VerifiedEmail>
            </div>
          </div>
      </div>
  );
};