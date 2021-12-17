import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { AuthContext } from "../context/AuthContext";

const SidebarRoom = ({ key, room, active }) => {
  return (
    <>
      {active ? (
        <div className="room link-active">
          <Link to={String("/" + room.id + "/")}>{room.topic}</Link>
        </div>
      ) : (
        <div className="room">
          <Link to={String("/" + room.id + "/")}>{room.topic}</Link>
        </div>
      )}
    </>
  );
};

export default SidebarRoom;
