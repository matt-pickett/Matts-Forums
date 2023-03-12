import React from "react";
import Navbar from "./navbar";
import "./components.css"
export const PageLoader = () => {
  return (
    <div>
      <Navbar/>
      <div className="center">
        <div className="loader"></div>
      </div>
    </div>
  );
};