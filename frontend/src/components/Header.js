import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";

import { AuthContext } from "../context/AuthContext";

const Header = () => {
  let { user, logoutUser } = useContext(AuthContext);
  console.log("user is ", user);

  return (
    <div className="header">
      <div className="sub-header">
        <h1>
          <Link to="/" className="Link">
            ChatApp
          </Link>
        </h1>
      </div>
      {user === null ? (
        <div className="sub-header">
          <h1>
            <Link to="/login/" className="Link">
              Login
            </Link>
          </h1>
        </div>
      ) : (
        <div className="sub-header">
          <h1>
            <Link to="/profile/">{user.username}</Link>
          </h1>
          <h1>
            <button onClick={logoutUser} className="Link">
              Logout
            </button>
          </h1>
        </div>
      )}
    </div>
  );
};

export default Header;
