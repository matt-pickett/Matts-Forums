import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { handleRequest } from "./errorHandle";
import { GetLastUpdate } from "./getDate";

export default function Info() {
 const [data, setData] = useState({
   title: "",
   description: "",
   username: "",
   user_id: "",
   lastUpdated: ""
 });
 const params = useParams();
 const navigate = useNavigate();
 async function getData() {
     try {
     const response = await fetch(`${process.env.REACT_APP_API_SERVER_URL}/${params.id.toString()}`);
     const data = await handleRequest(response);
     if(!data) {
      navigate("*");
      return;
     }
     setData(data);
    } 
    catch (error) {
     console.error(error);
     navigate("*");
   }
   }

 useEffect(() => {
   getData();
   return;
 }, [params.id, navigate]);
  
 return (
    <div className="d-flex flex-column align-items-center justify-content-center" style={{ height: "100vh" }}>
        <h1>{data.title}</h1>
        <h2>{data.description}</h2>
        <div>
            <div style={{position: "fixed", left: "50%", bottom: "0px",transform: "translate(-50%, -50%)"}}>
                <div>Post by: {data.username}</div>
                <div>
                    <span>Last updated: </span>
                    <GetLastUpdate time={data.lastUpdated}></GetLastUpdate>
                </div>
            </div>
        </div>
    </div>
 );
}