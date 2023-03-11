import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { handleArrayRequest } from './errorHandle';

// Had to make this function NOT an implicit return arrow function
// to define isAuthenticated. So I put {} after the => instead of (),
// then said return ( [the HTML inside here is what returns] );
const Record = (props) => {
  const { isAuthenticated, user } = useAuth0();
  return (
 <tr>
   <td>
    <Link className="btn btn-link" to={`./info/${props.record._id}`}>{props.record.title}</Link>
   </td>
   <td className="text-light">{props.record.username}</td>
   {/* Users can only edit their own post */}
   {isAuthenticated && user.sub === props.record.user_id && (
    <>
      <td>
        <Link className="btn btn-link" to={`./update/${props.record._id}`}>Update</Link> |
        <button className="btn btn-link"
        onClick={() => {
          props.deleteRecord(props.record._id);
        }}
        >
        Delete
        </button>
      </td>
    </>
    )}
    {isAuthenticated && user.sub !== props.record.user_id && (
      <td></td>
    )}
    {!isAuthenticated && (
        <td>
        </td>
      )}
 </tr>
)};
 
export default function Display() {
  const [data, setData] = useState([]);
   const navigate = useNavigate();
 async function getData() {
    // 'https://[project-name].onrender.com'
     const response = await fetch(`/posts`);
      console.log(response.json());
      const data = await handleArrayRequest(response);
      console.log(data);
      if(!data) {
        navigate("*");
        return;
      }
     setData(data);
   }

 useEffect(() => {
   getData();
   return;
 }, [data.length]);
 
 async function deleteRecord(id) {
   await fetch(`./posts/${id}`, {
     method: "DELETE"
   });
 
   const newData = data.filter((el) => el._id !== id);
   setData(newData);
 }
 
 function recordList() {
   
   return data.map((record) => {
     return (
       <Record
         record={record}
         deleteRecord={() => deleteRecord(record._id)}
         key={record._id}
       />
     );
   });
 }

 const { isAuthenticated } = useAuth0();
 return (
    <div>
      
      <div className="d-flex flex-column align-items-center justify-content-center" style={{ height: "100vh" }}>
        <h1>Posts</h1>
        <table className="table table-dark table-bordered table-striped table-hover" style={{ marginTop: 20, width: "50vw"}}>
          <thead className="text-light">
            <tr>
              <th>Title</th>
              <th>Username</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>{recordList()}</tbody>
        </table>
        {isAuthenticated && (
          <Link to="/create">Create Post</Link>
        )}
      </div>
    </div>
  );
}