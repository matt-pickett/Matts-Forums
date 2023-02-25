import React from "react";

function parseHour(hour) {
    if (hour > 12) {
      hour = hour - 12;
    }
    else if (hour === 0) {
      hour = 12;
    }
    return hour;
  }

  export const GetLastUpdate = (props) => {
    console.log(props);
    const last = new Date(props.time);
    const day = last.getDate();
    const month = last.toLocaleString('default', { month: 'long' });
    const year = last.getFullYear();
    let militaryHour = last.getHours();
    const timeVal = (militaryHour >= 12) ? "PM" : "AM";
    const hour = parseHour(militaryHour);
    const minute = (last.getMinutes()<10?'0':'') + last.getMinutes()
    console.log(minute);
    return (
      <div className="profile__value">{month} {day}, {year} @ {hour}:{minute} {timeVal}</div>
    );
  }