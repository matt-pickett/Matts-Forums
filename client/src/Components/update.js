import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { useAuth0 } from "@auth0/auth0-react";
import { handleRequest } from "./errorHandle";

export default function Update() {
  const [data, setData] = useState({
    title: "",
    description: "",
    username: "",
    user_id: "",
    lastUpdated: ""
  });
  const params = useParams();
  const navigate = useNavigate();
  const { user, getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    async function getData() {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_SERVER_URL}/${params.id.toString()}`);
        const data = await handleRequest(response);
        setData(data);
      } 
      catch (error) {
        console.error(error);
        navigate("*");
      }
    }
    getData();
  }, [params.id, navigate]);

  // These methods will update the state properties.
  function updateForm(value) {
    value.username = user.nickname;
    value.user_id = user.sub;
    value.lastUpdated = Date().toLocaleString();
    setData((prev) => {
      return { ...prev, ...value };
    });
  }

  async function onSubmit(e) {
    e.preventDefault();
    const updatedPost = {
      title: data.title,
      description: data.description,
      username: data.username,
      user_id: data.user_id,
      lastUpdated: data.lastUpdated
    };

    const token = await getAccessTokenSilently();
    // This will send a post request to update the data in the database.
    await fetch(`${process.env.REACT_APP_API_SERVER_URL}/${params.id}`, {
      method: "PATCH",
      body: JSON.stringify(updatedPost),
      headers: {
        'Content-Type': 'application/json',
        "Authorization": `Bearer ${token}`
      },
    });

    navigate("/");
  }

  return (
    <div className="d-flex flex-column align-items-center justify-content-center" style={{ height: "100vh" }}>
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
          <textarea
            type="text"
            className="form-control"
            id="description"
            value={data.description}
            onChange={(e) => updateForm({ description: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            className="form-control"
            id="username"
            value={data.username}
            disabled={true}
          />
        </div>
        <div className="form-group">
          <input
            type="submit"
            value="Update Post"
            className="btn btn-primary mt-3"
          />
        </div>
      </form>
    </div>
  );
}