import React, { useState, useEffect, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ReactComponent as ArrowLeft } from "../assets/arrow-left.svg";

import { AuthContext } from "../context/AuthContext";

const LoginPage = () => {
  let { loginUser } = useContext(AuthContext);

  return (
    <div className="login-page">
      <form
        onSubmit={(e) => {
          loginUser(e);
        }}
      >
        <div className="login-form">
            <input type="text" name="username" placeholder="username" />
            <input type="password" name="password" placeholder="password" />
            <input type="submit" value="Login" />

          <Link className="p-under-form" to="/register/">
            Didn't have an account? register here
          </Link>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
