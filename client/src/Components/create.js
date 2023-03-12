import React, { useState } from 'react';
import { useNavigate } from "react-router";
import { useAuth0 } from "@auth0/auth0-react";
import { handleRequest } from './errorHandle';
export default function Create() {
 const [data, setData] = useState({
   title: "",
   description: "",
   username: "",
   user_id: "",
   lastUpdated: ""
 });
 const navigate = useNavigate();
 const { user } = useAuth0();

 function updateForm(value) {
  value.username = user.nickname;
  value.user_id = user.sub;
  value.lastUpdated = Date().toLocaleString();
  console.log(value);
   return setData((prev) => {
     return { ...prev, ...value };
   });
 }
 
 async function onSubmit(e) {
   e.preventDefault();
   const newPerson = { ...data };
   
   const response = await fetch("https://mattsposts-api.onrender.com/posts", {
     method: "POST",
     headers: {
       "Content-Type": "application/json",
     },
     body: JSON.stringify(newPerson),
   });
   
   const ret = await handleRequest(response)
   if (!ret) {
    navigate("*");
    return;
   }

   // Reset the data
   setData({ 
    title: "", 
    description: "", 
    username: "", 
    user_id: "",
    lastUpdated: ""
    });
   navigate("/");
 }
 
 return (
   <div className="d-flex flex-column align-items-center justify-content-center" style={{ height: "100vh" }}>
     <h3>New Post</h3>
     <form onSubmit={onSubmit}>
       <div className="form-group">
         <label htmlFor="title">Title</label>
         <input
           type="text"
           className="form-control"
           id="title"
           value={data.title}
           onChange={(e) => updateForm({ title: e.target.value })}
         />
       </div>
       <div className="form-group">
         <label htmlFor="description">Description</label>
         <textarea
           type="text"
           className="form-control"
           id="description"
           value={data.description}
           onChange={(e) => updateForm({ description: e.target.value})}
         />
       </div>
       <div className="form-group">
         <label htmlFor="username">Username</label>
         <input
           type="text"
           className="form-control"
           id="username"
           defaultValue={user.nickname}
           disabled={true}
         />
       </div>
       <div className="form-group pt-3">
         <input
           type="submit"
           value="Create Post"
           className="btn btn-primary"
         />
       </div>
     </form>
   </div>
 );
}