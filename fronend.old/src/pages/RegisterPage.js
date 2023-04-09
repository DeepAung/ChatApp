import React, { useState, useEffect, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ReactComponent as ArrowLeft } from "../assets/arrow-left.svg";

import { AuthContext } from "../context/AuthContext";

const RegisterPage = () => {
  let { loginUser, registerUser } = useContext(AuthContext);

  return (
    <div className="login-page">
      <form
        onSubmit={(e) => {
          registerUser(e);
        }}
      >
        <div className="login-form">
          <input type="text" name="username" placeholder="username" />
          <input type="password" name="password" placeholder="password" />
          <input
            type="password"
            name="password2"
            placeholder="confirm your password"
          />
          <input type="submit" value="Login" />

          <Link className="p-under-form" to="/login/">
            Alredy have an account? login here
          </Link>
        </div>
      </form>
    </div>
  );
};

export default RegisterPage;
