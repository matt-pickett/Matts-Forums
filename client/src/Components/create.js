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
 // These methods will update the state properties.
 function updateForm(value) {
  value.username = user.nickname;
  value.user_id = user.sub;
  value.lastUpdated = Date().toLocaleString();
  console.log(value);
   return setData((prev) => {
     return { ...prev, ...value };
   });
 }
 
 // This function will handle the submission.
 async function onSubmit(e) {
   e.preventDefault();
 
   // When a post request is sent to the create url, we'll add a new record to the database.
   const newPerson = { ...data };
   
   const response = await fetch("./posts", {
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
 
 // This following section will display the form that takes the input from the user.
 return (
   <div>
     <h3>Create New Record</h3>
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
          //  onChange={(e) => updateForm({ username: e.target.value })}
         />
       </div>
       <div className="form-group">
         <label htmlFor="user_id">User Id</label>
         <input
           type="text"
           className="form-control"
           id="user_id"
           defaultValue={user.sub}
           disabled={true}
          //  onChange={(e) => updateForm({ user_id: e.target.value })}
         />
       </div>
       <div className="form-group">
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