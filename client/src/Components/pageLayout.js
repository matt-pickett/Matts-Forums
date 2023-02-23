import React from "react";
import Navbar from "./navbar"
// import { MobileNavBar } from "./navigation/mobile/mobile-nav-bar";
// import { PageFooter } from "./page-footer";

export const PageLayout = ({ children }) => {
  return (
    <div className="page-layout">
      <Navbar />
      {/* <MobileNavBar /> */}
      <div className="page-layout__content">{children}</div>
      {/* <PageFooter /> */}
    </div>
  );
};