import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { ReactComponent as ArrowLeft } from "../assets/arrow-left.svg";

import Navbar from "../components/Navbar";

const ProfilePage = () => {
  let { user, authTokens } = useContext(AuthContext);
  let [User, setUser] = useState(null);
  let [src, setSrc] = useState(null);
  let navigate = useNavigate();
  let path;

  //  = require("../images/avatar.svg");

  useEffect(() => {
    getUser();
  }, []);

  let getUser = async () => {
    let response = await fetch(
      `http://127.0.0.1:8000/api/get-user/${user.user_id}/`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + String(authTokens.access),
        },
      }
    );
    let data = await response.json();
    console.log("get_user");
    setUser(data);
    return data.avatar;
  };

  let updateProfile = async (e) => {
    e.preventDefault();

    let file = e.target.avatar.files[0];
    let formData = new FormData();
    formData.append("first_name", e.target.first_name.value);
    formData.append("last_name", e.target.last_name.value);
    formData.append("address", e.target.address.value);
    formData.append("bio", e.target.bio.value);
    if (file) {
      formData.append("avatar", file);
    }

    console.log("form: " + JSON.stringify(formData));

    let response = await fetch(`http://127.0.0.1:8000/api/update-user/`, {
      method: "PATCH",
      headers: {
        // "Content-Type": "multipart/form-data",
        Authorization: "Bearer " + String(authTokens.access),
      },
      body: formData,
    });

    let data = await response.json();

    if (true) {
      alert(JSON.stringify(data));
    }
    navigate("/");
  };

  return (
    <>
      <div className="nav-bar">
        <Link to="/">
          <ArrowLeft className="arrow-left" />
        </Link>
        <input className="pointer" type="submit" value="Update" />
      </div>
      <div className="login-page">
        <form
          onSubmit={(e) => {
            updateProfile(e);
          }}
        >
          <div className="login-form">
            <img src={process.env.PUBLIC_URL + User?.avatar} alt="avatar" />

            <div className="wrapper">
              <label>Avatar: </label>
              <input type="file" name="avatar" />
            </div>
            <div className="wrapper">
              <label>Username: </label>
              <p>{User?.username}</p>
            </div>
            <div className="wrapper">
              <label>First name: </label>
              <input
                type="text"
                name="first_name"
                defaultValue={User?.first_name}
              />
            </div>
            <div className="wrapper">
              <label>Last name: </label>
              <input
                type="text"
                name="last_name"
                defaultValue={User?.last_name}
              />
            </div>
            <div className="wrapper">
              <label>Email: </label>
              <input type="email" name="address" defaultValue={User?.address} />
            </div>
            <div className="wrapper">
              <label>Bio: </label>
              <input type="text" name="bio" defaultValue={User?.bio} />
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default ProfilePage;
