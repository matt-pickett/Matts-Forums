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
  // useState just initializes variables
  const [data, setData] = React.useState(null);

  const getData = () => {
    fetch("/posts")
      // Parse json resolve and return it to next then block
      .then((res) => {
      if (!res.ok) {
        throw new Error("Network response was not ok");
      }
      console.log(res.json());
      return res.json();
      })
      .then((data) => {
        setData(data);
        console.log(data);
        return data;
      })
      // Call setData function with parsed json and return it (return doesn't matter)
      .then((data) => setData(data)) 
      // Catch any failure callback and log it
      .catch((e) => console.log(e));
  }

  // useEffect runs "side effects" independently of rendering
  // Side effects are using fetch, using a timer,
  // or directly updating the DOM without rendering
  React.useEffect(() => {
    getData();
  }, []);

  const { isLoading } = useAuth0();

  if (isLoading) {
    return (
      <div className="page-layout">
        <PageLoader />
      </div>
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