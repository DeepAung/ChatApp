import { AuthContext } from "@/contexts/AuthContext";
import React, { useContext } from "react";

function Login() {
  let { login } = useContext(AuthContext);
  function loginHandler(e: any) {
    e.preventDefault();
    const data = {
      username: e.target.username.value,
      password: e.target.password.value,
    };
    login(data);
  }

  return (
    <div className="container">
      <form onSubmit={(e) => loginHandler(e)}>
        <input type="text" name="username" />
        <input type="password" name="password" />
        <input type="submit" value="Login" />
      </form>
    </div>
  );
}

export default Login;
