import React from 'react';
import { Route, Routes, Navigate } from "react-router-dom";
import logo from "./logo.svg";
import "./App.css";


//Auth0
import { useAuth0 } from "@auth0/auth0-react";
import Auth0ProviderWithNavigate from './Auth0Provider';

// Components
import Navbar from "./Components/navbar";
import Update from "./Components/update";
import RecordList from "./Components/display";
import Create from "./Components/create";
import { NotFoundPage } from "./Components/notFound";
import { PageLoader } from "./Components/pageLoader";
import { ProfilePage } from "./Components/profile";
import { AuthenticationGuard } from "./Components/routeGuard";

function App() {
  // Initializes data to null and provides a function
  // setData to update
  // useState just initializes variables
  const [data, setData] = React.useState(null);

  // Both Node backend and React have to be running 
  // on different ports to fetch API data
  const getData = () => {
    fetch("./posts")
      // Parse json resolve and return it to next then block
      .then((res) => res.json())
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
      <div className="App">
        <header className="App-header">
          <Navbar />
          <Routes>
            <Route exact path="/" element={<RecordList />} />
            <Route
              path="/:id"
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
        </header>
      </div>
    </Auth0ProviderWithNavigate>
  );
}

export default App;