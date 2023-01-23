import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
 
export default function Update() {
 const [data, setData] = useState({
   title: "",
   description: ""
 });
 const params = useParams();
 const navigate = useNavigate();
 async function getData() {
     const id = params.id.toString();
     console.log(id)
     console.log(params)
     const response = await fetch(`./posts/${params.id.toString()}`);
 
     if (!response.ok) {
       const message = `An error has occurred: ${response.statusText}`;
       window.alert(message);
       return;
     }
 
     const data = await response.json();
     if (!data) {
       window.alert(`Record with id ${id} not found`);
       navigate("/");
       return;
     }
 
     setData(data);
   }

 useEffect(() => {
   getData();
   return;
 }, [params.id, navigate]);
 
 // These methods will update the state properties.
 function updateForm(value) {
   return setData((prev) => {
     return { ...prev, ...value };
   });
 }
 
 async function onSubmit(e) {
   e.preventDefault();
   const updatedPost = {
     title: data.title,
     description: data.description
   };
 
   // This will send a post request to update the data in the database.
   await fetch(`./posts/${params.id}`, {
     method: "PATCH",
     body: JSON.stringify(updatedPost),
     headers: {
       'Content-Type': 'application/json'
     },
   });
 
   navigate("/");
 }
 
 // This following section will display the form that takes input from the user to update the data.
 return (
   <div>
     <h3>Update Post</h3>
     <form onSubmit={onSubmit}>
       <div className="form-group">
         <label htmlFor="title">Title: </label>
         <input
           type="text"
           className="form-control"
           id="title"
           value={data.title}
           onChange={(e) => updateForm({ title: e.target.value })}
         />
       </div>
       <div className="form-group">
         <label htmlFor="description">Description: </label>
         <input
           type="text"
           className="form-control"
           id="description"
           value={data.description}
           onChange={(e) => updateForm({ description: e.target.value })}
         />
       </div>
       <div className="form-group">
         <input
           type="submit"
           value="Update Post"
           className="btn btn-primary"
         />
       </div>
     </form>
   </div>
 );
}