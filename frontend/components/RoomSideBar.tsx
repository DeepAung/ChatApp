import { AuthContext } from "@/contexts/AuthContext";
import { useContext, useState } from "react";

import styles from "./RoomSideBar.module.css";
import { Room } from "@/types/Room";
import Link from "next/link";

function RoomSideBar({ rooms }: { rooms: Room[] }) {
  const [clickedIndex, setClickedIndex] = useState(-1);
  return (
    <div className={styles.sideBar}>
      {rooms?.map((room, index) => (
        <Link
          className={`${styles.roomItem} 
            ${clickedIndex == index ? styles.selected : ""}
          `}
          onClick={() => {
            setClickedIndex(index);
          }}
          href={`/room/${room.id}`}
          key={index}
        >
          {room.topic}
        </Link>
      ))}
    </div>
  );
}

export default RoomSideBar;
