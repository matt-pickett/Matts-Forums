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
     const response = await fetch(`https://mattsposts-api-api.onrender.com/posts/${params.id.toString()}`);

     const data = await handleRequest(response)
     if(!data) {
      navigate("*");
      return;
     }
 
     setData(data);
   }

 useEffect(() => {
   getData();
   return;
 }, [params.id, navigate]);
  
 return (
    <div className="d-flex flex-column align-items-center justify-content-center" style={{ height: "100vh" }}>
        <h1 style={{position: "fixed", left: "50%", top: "200px",transform: "translate(-50%, -50%)"}}>
          {data.title}
        </h1>
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