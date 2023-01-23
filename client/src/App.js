import React from 'react';
import { Route, Routes } from "react-router-dom";
import logo from "./logo.svg";
import "./App.css";

// Components
import Navbar from "./Components/navbar";
import Update from "./Components/update";
import RecordList from "./Components/read";
import Create from "./Components/create";

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

  return (
    <div className="App">
      <header className="App-header">
      <Routes>
        <Route exact path="/" element={<RecordList />} />
        <Route path="/:id" element={<Update />} />
        <Route path="/create" element={<Create />} />
      </Routes>
      <Navbar />
      </header>
    </div>
  );
}

export default App;