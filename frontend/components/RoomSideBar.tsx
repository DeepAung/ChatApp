import { useContext, useState } from "react";

import styles from "./RoomSideBar.module.css";
import { useRouter } from "next/router";
import { StoreContext } from "@/contexts/StoreContext";

function RoomSideBar() {
  const router = useRouter();

  const { rooms } = useContext(StoreContext);
  const [clickedIndex, setClickedIndex] = useState(-1);

  return (
    <div className={styles.sideBar}>
      {rooms?.map((room, index) => (
        <div
          className={`${styles.roomItem} 
            ${clickedIndex == index ? styles.selected : ""}
          `}
          onClick={() => {
            setClickedIndex(index);
            router.push(`?room=${room.id}`);
          }}
          key={index}
        >
          {room.topic}
        </div>
      ))}
    </div>
  );
}

export default RoomSideBar;
