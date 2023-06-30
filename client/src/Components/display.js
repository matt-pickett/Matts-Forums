import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { handleArrayRequest } from './errorHandle';
import { PageLoader } from "./pageLoader";
import { decryptUserId } from "./decrypt";

// Had to make this function NOT an implicit return arrow function
// to define isAuthenticated. So I put {} after the => instead of (),
// then said return ( [the HTML inside here is what returns] );
const Record = (props) => {
  const navigate = useNavigate();
   const { isAuthenticated, user } = useAuth0();
   const user_id = decryptUserId(props.record.user_id);
  return (
 <tr>
   <td>
    <Link className="btn btn-link my-link" to={`./info/${props.record._id}`}>{props.record.title}</Link>
   </td>
   <td className="text-light">{props.record.username}</td>
   {/* Users can only edit their own post */}
   {isAuthenticated && user.sub === user_id && (
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
    {isAuthenticated && user.sub !== user_id && (
      <td></td>
    )}
    {!isAuthenticated && (
        <td></td>
      )}
 </tr>
)};
 
export default function Display() {
  const [data, setData] = useState([]);
  const [isEmpty, setIsEmpty] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // add new state variable
  const navigate = useNavigate();
  const { isAuthenticated, user, getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    async function fetchData() {
        setIsLoading(true);
        try {
            const response = await fetch(`${process.env.REACT_APP_API_SERVER_URL}`);
            // Error handle response
            const data = await handleArrayRequest(response);
            if (!data) {
              setIsEmpty(true);
            }
            setData(data);
        } catch (error) {
            console.error(error)
            throw new Error("An error occurred while fetching the results:", error);
        } finally {
            setIsLoading(false);
        }
    }
    fetchData();
  }, []);
 
 async function deleteRecord(id) {
   try {
      const token = await getAccessTokenSilently();
      await fetch(`${process.env.REACT_APP_API_SERVER_URL}/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        },
      });

      // Optimzation technique
      // Reduce need for another GET request by filtering data
      // because we already know what was deleted
      const newData = data.filter((el) => el._id !== id);
      setData(newData);
    } 
    catch (error) {
      console.error(error);
      throw new Error("An error occurred while deleting the record:", error);
  }
 }
 
  function recordList() {
    return data.map((record) => {
      return (
        <Record
          record={record}
          deleteRecord={() => deleteRecord(record._id)}
          key={record._id}
          isAuthenticated={isAuthenticated}
          user={user}
        />
      );
    });
  }

  if (isLoading) {
    return (
      <div className="d-flex flex-column align-items-center justify-content-center" style={{ height: "100vh" }}>
        <PageLoader />
      </div>
    );
  }

 if (isEmpty) {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center" style={{ height: "100vh" }}>
      <h1>No posts could be found</h1>
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
        {!isAuthenticated && (
          <h4>Log in or sign up to make a post!</h4>
        )}
      </div>
    </div>
  );
}