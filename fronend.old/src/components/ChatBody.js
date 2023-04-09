import React, { useState, useEffect, useContext, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

import { ReactComponent as Setting } from "../assets/icons8-settings.svg";

import Message from "./Message";

const ChatBody = ({
  roomId,
  messagesState,
  roomsState,
  changeState,
  chatSocket,
}) => {
  let [messages, setMessages] = messagesState;
  let [change, setChange] = changeState;
  let [room, setRoom] = useState({});
  let [dict, setDict] = useState({});
  let { user, authTokens } = useContext(AuthContext);
  let navigate = useNavigate();

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current.scrollIntoView({ behavior: "auto" });
  };

  useEffect(
    (messages) => {
      getRoom();
      getUsers();
      scrollToBottom();
    },
    [messages]
  );

  useEffect(() => {
    chatSocket.onopen = async (e) => {
      console.log("open");
    };

    chatSocket.onmessage = async (e) => {
      const data = await JSON.parse(e.data);
      let index = await 1;
      console.log("websocket onmessage: ", JSON.stringify(data));

      if (data.method === "POST") {
        // setChange(change + 1);
        setMessages((prev) => {
          return [...prev, data];
        });
      } else if (data.method === "EDIT") {
        setMessages((prev) => {
          let dummy = prev;
          for (var i in dummy) {
            if (dummy[i].id === data.id) {
              dummy[i] = data;
              break;
            }
          }
          console.log(`dummy: ${JSON.stringify(dummy)}`);
          return [...dummy];
        });
      } else if (data.method === "DELETE") {
        setMessages((prev) => prev.filter((el) => el.id !== data.id));
      }
    };
  }, [messages]);

  let getRoom = async (e) => {
    let response = await fetch(
      `http://127.0.0.1:8000/api/detail-room/${roomId}/`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + String(authTokens.access),
        },
      }
    );

    let data = await response.json();

    setRoom(data);
  };

  let commentSubmit = async (e) => {
    e.preventDefault();

    let form = await {
      user: user.user_id,
      room: Number(roomId),
      content: e.target.value,
    };

    let response = await fetch(`http://127.0.0.1:8000/api/create-message/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + String(authTokens.access),
      },
      body: JSON.stringify(form),
    });

    let data = await response.json();

    console.log(`commentSubmit: ${JSON.stringify(form)}`);
    if (response.ok) {
      chatSocket.send(JSON.stringify({ ...data, method: "POST" }));
    } else {
      alert(`error ${response.statusText}`);
    }

    e.target.value = "";
    scrollToBottom();
  };

  let commentEnterSubmit = async (e) => {
    if (e.key === "Enter" && e.shiftKey == false) {
      commentSubmit(e);
    }
  };

  let getUsers = async () => {
    let response = await fetch(
      `http://127.0.0.1:8000/api/list-user/${roomId}/`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + String(authTokens.access),
        },
      }
    );
    let data = await response.json();

    setDict((prev) => {
      let dummy = prev;
      for (let item of data) {
        dummy[item.id] = item;
      }
      return dummy;
    });
  };

  return room.participants?.indexOf(user.user_id) > -1 ? (
    <div className="chat-body">
      <div className="room-header">
        <h1>{room?.topic}</h1>
        <Link className="Link" to="setting/">
          <Setting className="setting" />
        </Link>
      </div>
      <div className="content">
        {messages?.map((message, index) => (
          <Message
            message={message}
            user={user}
            key={message.id}
            changeState={[change, setChange]}
            chatSocket={chatSocket}
            dict={dict[message.user]}
          />
        ))}
        <div ref={messagesEndRef}></div>
      </div>
      <div className="comment-input">
        <form onSubmit={commentSubmit}>
          <textarea
            name="comment"
            placeholder="comment here..."
            onKeyPress={commentEnterSubmit}
          ></textarea>
        </form>
      </div>
    </div>
  ) : (
    <div ref={messagesEndRef}></div>
  );
};

export default ChatBody;
