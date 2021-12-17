import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { ReactComponent as ArrowLeft } from "../assets/arrow-left.svg";

const CreateRoomPage = () => {
  let { user, authTokens } = useContext(AuthContext);
  let navigate = useNavigate();

  let createRoom = async (e) => {
    e.preventDefault();
    let response = await fetch(`http://127.0.0.1:8000/api/create-room/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + String(authTokens.access),
      },
      body: JSON.stringify({
        host: user.user_id,
        topic: e.target.topic.value,
        participants: [],
      }),
    });
    let data = await response.json();
    if (response.ok) {
      navigate("/");
    } else {
      alert("sth went wrong");
    }
  };

  return (
    <>
      <div className="nav-bar">
        <Link to="/">
          <ArrowLeft className="arrow-left" />
        </Link>
      </div>
      <div className="login-page">
        <form
          onSubmit={(e) => {
            createRoom(e);
          }}
        >
          <div className="login-form">
            <div className="wrapper">
              <label>host: </label>
              <p> {user.username}</p>
            </div>
            <input type="text" name="topic" placeholder="topic" />
            <input className="pointer" type="submit" value="Create" />
          </div>
        </form>
      </div>
    </>
  );
};

export default CreateRoomPage;
