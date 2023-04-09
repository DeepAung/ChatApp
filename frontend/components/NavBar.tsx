import { AuthContext } from "@/contexts/AuthContext";
import Link from "next/link";
import React, { useContext } from "react";

import styles from "./Navbar.module.css";

function NavBar() {
  const { user, token, logout } = useContext(AuthContext);
  return (
    <div className={styles.navbarContainer}>
      <Link href="/" className={styles.title}>
        Chat App
      </Link>
      {user ? (
        <button className={styles.btn} onClick={(e) => logout()}>
          Logout
        </button>
      ) : (
        <Link className={styles.btn} href="/login">
          Login
        </Link>
      )}
    </div>
  );
}

export default NavBar;
