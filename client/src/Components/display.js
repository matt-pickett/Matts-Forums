import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { handleArrayRequest } from './errorHandle';
import {GetLastUpdate} from "./getDate"
// Had to make this function NOT an implicit return arrow function
// to define isAuthenticated. So I put {} after the => instead of (),
// then said return ( [the HTML inside here is what returns] );
const Record = (props) => {
  const { isAuthenticated, user } = useAuth0();
  return (
 <tr>
   <td className='text-light'>{props.record.title}</td>
   <td className='text-light'>{props.record.description}</td>
   <td className='text-light'>{props.record.username}</td>
   <td className='text-light'><GetLastUpdate time={props.record.lastUpdated}></GetLastUpdate></td>
   {/* Users can only edit their own post */}
   {isAuthenticated && user.sub === props.record.user_id && (
    <>
      <td>
        <Link className="btn btn-link" to={`./${props.record._id}`}>Update</Link> |
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
 </tr>
)};
 
export default function RecordList() {
  const [data, setData] = useState([]);
   const navigate = useNavigate();
 async function getData() {
     const response = await fetch(`./posts`);
 
      const data = await handleArrayRequest(response);
      if(!data) {
        navigate("*");
        return;
      }
     setData(data);
   }

 // This method fetches the records from the database.
 useEffect(() => {
   getData();
   return;
 }, [data.length]);
 
 // This method will delete a record
 async function deleteRecord(id) {
   await fetch(`./posts/${id}`, {
     method: "DELETE"
   });
 
   const newData = data.filter((el) => el._id !== id);
   setData(newData);
 }
 
 // This method will map out the records on the table
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
     <h3>Record List</h3>
     <table className="table table-striped" style={{ marginTop: 20 }}>
       <thead>
         <tr className='text-light'>
           <th>Title</th>
           <th>Description</th>
           <th>Username</th>
           <th>Last update</th>
           <th>Action</th>
         </tr>
       </thead>
       <tbody>{recordList()}</tbody>
     </table>
     {isAuthenticated && (
      <>
        <Link to="/create">Create Record</Link>
      </>
      )}
   </div>
 );
}