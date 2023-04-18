import Link from "next/link";
import { useContext, useState } from "react";

import styles from "./RoomSideBar.module.css";
import { StoreContext } from "@/contexts/StoreContext";

function UserSideBar() {
  const { users } = useContext(StoreContext);
  const [clickedIndex, setClickedIndex] = useState(-1);

  return (
    <div className={styles.sideBar}>
      {users?.map((user, index) => (
        <Link
          className={`${styles.roomItem} 
            ${clickedIndex == index ? styles.selected : ""}
          `}
          onClick={() => {
            setClickedIndex(index);
          }}
          href={`/user/${user.id}`}
          key={index}
        >
          {user.username}
        </Link>
      ))}
    </div>
  );
}

export default UserSideBar;
