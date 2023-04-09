import React, { useState, useEffect, useContext } from "react";
import { useLocation } from "react-router-dom";

import ChatBody from "../components/ChatBody";
import Sidebar from "../components/Sidebar";
import ParticipantsShow from "../components/ParticipantsShow";
import { AuthContext } from "../context/AuthContext";

const RoomPage = ({ chatSocket }) => {
  let [messages, setMessages] = useState([]);
  let [change, setChange] = useState(0);
  let [rooms, setRooms] = useState([]);
  let location = useLocation();
  let roomId = location.pathname.slice(1, 2);
  let { authTokens } = useContext(AuthContext);

  useEffect(() => {
    getMessages();
  }, [change, window.location.pathname]);

  let getMessages = async () => {
    console.log(`getMessages called`);
    if (roomId === "") {
      return;
    }
    let response = await fetch(
      `http://127.0.0.1:8000/api/list-message/${roomId}/`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + String(authTokens.access),
        },
      }
    );
    let data = await response.json();
    setMessages(data);
  };

  return (
    <div className="room-page">
      <Sidebar roomId={roomId} />
      {messages ? (
        <ChatBody
          roomId={roomId}
          messagesState={[messages, setMessages]}
          changeState={[change, setChange]}
          chatSocket={chatSocket}
        />
      ) : (
        <></>
      )}
      <ParticipantsShow roomId={roomId} />
    </div>
  );
};

export default RoomPage;
