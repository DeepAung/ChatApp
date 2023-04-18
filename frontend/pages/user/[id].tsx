import { AuthContext } from "@/contexts/AuthContext";
import { User } from "@/types/User";
import { fetchData } from "@/utils/fetchData";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useMemo, useState } from "react";

import Image from "next/image";

import styles from "./[id].module.css";

function UserProfile() {
  const router = useRouter();
  const { id: idStr } = router.query;
  const id = Number(idStr);

  const { token } = useContext(AuthContext);
  const [user, setUser] = useState<User>();

  const hasName = useMemo(() => {
    if (user && user.first_name && user.last_name) return true;
    return false;
  }, [user]);

  useEffect(() => {
    if (Number.isNaN(id) || token == undefined) return;

    fetchData(`users/${id}/`, "GET", {}, token)
      .then((data) => setUser(data))
      .catch((err) => console.log(err));
  }, [id, token]);

  return (
    <div className={styles.container}>
      {user && (
        <Image
          priority
          src={user?.get_avatar}
          width={1000}
          height={1000}
          alt="Profile"
          className={styles.img}
        />
      )}
      <div className={styles.info}>
        <div className={styles.name}>
          {hasName ? (
            <>
              <h1>{`${user?.first_name} ${user?.last_name}`}</h1>
              <h3>({user?.username})</h3>
            </>
          ) : (
            <h1>{user?.username}</h1>
          )}
        </div>

        <div className={styles.address}>
          <h3>Address</h3>
          <p>{user?.address || "None"}</p>
        </div>

        <div className={styles.bio}>
          <h3>Bio</h3>
          <p>{user?.bio || "None"}</p>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
