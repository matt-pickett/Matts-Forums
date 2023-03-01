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
     const response = await fetch(`/posts/${params.id.toString()}`);

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
    <div>
        <h1>
          {data.title}
        </h1>
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