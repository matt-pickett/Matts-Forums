import React from 'react';
import { Route, Routes, Navigate } from "react-router-dom";
import "./App.css";


//Auth0
import { useAuth0 } from "@auth0/auth0-react";
import Auth0ProviderWithNavigate from './Auth0Provider';

// Components
import Navbar from "./Components/navbar";
import Update from "./Components/update";
import Display from "./Components/display";
import Create from "./Components/create";
import Info from "./Components/info";
import { NotFoundPage } from "./Components/notFound";
import { PageLoader } from "./Components/pageLoader";
import { ProfilePage } from "./Components/profile";
import { AuthenticationGuard } from "./Components/routeGuard";

function App() {
  const { isLoading } = useAuth0();

  if (isLoading) {
    return (
      <PageLoader />
    );
  }
  return (
    <Auth0ProviderWithNavigate>
      <div className="App bg-dark">
          <Navbar />
          <Routes>
            <Route exact path="/" element={<Display />} />
            <Route path="/info/:id" element={<Info />} />
            <Route
              path="/update/:id"
              element={<AuthenticationGuard component={Update} />}
            />
            <Route
              path="/create"
              element={<AuthenticationGuard component={Create} />}
            />
            <Route
              path="/profile"
              element={<AuthenticationGuard component={ProfilePage} />}
            />
            <Route path="/notFound" element={<NotFoundPage />} />
            <Route path="*" element={<Navigate replace to="/notFound" />} />
          </Routes>
      </div>
    </Auth0ProviderWithNavigate>
  );
}

export default App;