import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import SidebarRoom from "./SidebarRoom";
import { AuthContext } from "../context/AuthContext";

import { ReactComponent as Add } from "../assets/add.svg";

const Sidebar = ({ roomId }) => {
  // let [messages, setMessages] = messagesState;

  let { user, authTokens } = useContext(AuthContext);
  let [rooms, setRooms] = useState([]);

  useEffect(() => {
    getRooms();
  }, []);

  let getRooms = async () => {
    let response = await fetch(`http://127.0.0.1:8000/api/list-room/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + String(authTokens.access),
      },
    });
    let data = await response.json();
    setRooms(data);
    console.log(`getRooms ${JSON.stringify(data)}`);
  };

  let joinRoom = async (e) => {
    e.preventDefault();

    console.log(`joining`);
    let response = await fetch(
      `http://127.0.0.1:8000/api/join-room/${e.target.input.value}/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + String(authTokens.access),
        },
      }
    );
    let data = await response.json();

    if (response.ok) {
      var dummy = [data].concat(rooms);
      setRooms(dummy);
      console.log(`dummy ${JSON.stringify(dummy)}`);
    } else {
      alert(`error: ${data}`);
    }

    e.target.input.value = "";
  };

  return (
    <div className="side-bar">
      <h1>sidebar</h1>
      <form onSubmit={joinRoom} className="join-input">
        <input type="text" name="input" placeholder="enter room id here" />
        <input className="pointer" type="submit" value="JOIN" />
      </form>
      <div>
        {rooms.map((room, index) =>
          room.id == roomId ? (
            <SidebarRoom key={room.id} room={room} active={true} />
          ) : (
            <SidebarRoom key={room.id} room={room} active={false} />
          )
        )}
      </div>
      <div className="create-btn">
        <Link to="/create-room/">
          <Add className="add-btn" />
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
