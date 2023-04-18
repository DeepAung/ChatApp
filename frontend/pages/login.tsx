import { AuthContext } from "@/contexts/AuthContext";
import React, { useContext } from "react";

import styles from "./login.module.css";
import Link from "next/link";

function Login() {
  let { login } = useContext(AuthContext);
  async function loginHandler(e: any) {
    e.preventDefault();
    const data = {
      username: e.target.username.value,
      password: e.target.password.value,
    };
    login(data);
  }

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={(e) => loginHandler(e)}>
        <h1>Sign In</h1>
        <input
          className={styles.inputForm}
          type="text"
          name="username"
          aria-label="username"
        />
        <input
          className={styles.inputForm}
          type="password"
          name="password"
          aria-label="password"
        />
        <input className={styles.submitBtn} type="submit" value="Login" />
        <p>
          Don&apos;t have an Account? <Link href="/register">Sign in here</Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
