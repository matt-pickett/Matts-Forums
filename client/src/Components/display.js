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
  const navigate = useNavigate();
  return (
 <tr>
   <td>
    <Link className="btn btn-link my-link" to={`./info/${props.record._id}`}>{props.record.title}</Link>
   </td>
   <td className="text-light">{props.record.username}</td>
   {/* Users can only edit their own post */}
   {isAuthenticated && user.sub === props.record.user_id && (
    <>
      <td className="d-flex justify-content-center">
        <button className="btn btn-secondary me-3" onClick={() => navigate(`./update/${props.record._id}`)}>
          Update
        </button>
        <button className="btn btn-danger"
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
  const [isEmpty, setIsEmpty] = useState(false);
   const navigate = useNavigate();
 async function getData() {
     const response = await fetch(`https://mattsposts-api.onrender.com/posts`);
      const data = await handleArrayRequest(response);
      if(!data) {
        setIsEmpty(true);
      }
     setData(data);
   }

  // useEffect runs "side effects" independently of rendering
  // Side effects are using fetch, using a timer,
  // or directly updating the DOM without rendering
 useEffect(() => {
   getData();
   return;
 }, [data]);
 
 async function deleteRecord(id) {
   await fetch(`https://mattsposts-api.onrender.com/posts/${id}`, {
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
 if (isEmpty) {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center" style={{ height: "100vh" }}>
      <h1>No posts yet</h1>
      {isAuthenticated && (
          <button className="btn btn-primary" onClick={() => navigate("/create")}>
            Create Post
          </button>
      )}
    </div>
  );
 }
 return (
    <div>
      
      <div className="d-flex flex-column align-items-center justify-content-center" style={{ height: "100vh" }}>
        <h3>Posts</h3>
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
          <button className="btn btn-primary" onClick={() => navigate("/create")}>
            Create Post
          </button>
        )}
      </div>
    </div>
  );
}