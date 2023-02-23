import { useAuth0 } from "@auth0/auth0-react";
import React from "react";
import { PageLayout } from "./pageLayout";

export const ProfilePage = () => {
  const { user } = useAuth0();

  if (!user) {
    return null;
  }

  function parseHour(hour) {
    if (hour > 12) {
      hour = hour - 12;
    }
    else if (hour === 0) {
      hour = 12;
    }
    return hour;
  }

  const GetLastUpdate = (props) => {
    
    const last = new Date(props.time);
    const day = last.getDate();
    const month = new Intl.DateTimeFormat("en-US", { month: "long" }).format(last);
    const year = last.getFullYear();
    let militaryHour = last.getHours();
    const timeVal = (militaryHour >= 12) ? "PM" : "AM";
    const hour = parseHour(militaryHour);
    const minute = last.getMinutes();
    return (
      <div className="profile__value">Last updated: {month} {day}, {year} @ {hour}:{minute} {timeVal}</div>
    );
  }

  const VerifiedEmail = (props) => {
    const isVerified = props.verified ? "Yes" : "No";
    return (
      <div className="profile__value">Email verified: {isVerified}</div>
    );
  }

  return (
    <PageLayout>
      <div className="content-layout">
        <h1 id="page-title" className="content__title pt-5 mt-5">
          Profile Page
        </h1>
        <div className="content__body">
          <div className="profile-grid">
            <div className="profile__header">
              <img
                src={user.picture}
                alt="Profile"
                className="profile__avatar"
              />
              <div className="profile__headline">
                <h2 className="profile__title">{user.name}</h2>
                <span className="profile__description">{user.email}</span>
              </div>
            </div>
            <div className="profile__details">
                <GetLastUpdate time={user.updated_at}></GetLastUpdate>              
                <VerifiedEmail verified={user.email_verified}></VerifiedEmail>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};