import React, { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../context/AuthContext";

const Message = ({ message, user, changeState, chatSocket, dict }) => {
  let [visible, setVisible] = useState(true);
  let [change, setChange] = changeState;
  let [showMessage, setShowMessage] = useState(
    <p className="show-space">{message.content}</p>
  );
  let [btn, setBtn] = useState("EDIT");
  let { authTokens } = useContext(AuthContext);

  useEffect(() => {
    if (showMessage.type === "p") {
      setShowMessage(<p className="show-space">{message.content}</p>);
    }
  }, [message]);

  let deleteMessage = async (e) => {
    e.preventDefault();
    let response = await fetch(
      `http://127.0.0.1:8000/api/delete-message/${message.id}/`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + String(authTokens.access),
        },
      }
    );
    // setVisible(false);
    if (response.ok) {
      chatSocket.send(JSON.stringify({ ...message, method: "DELETE" }));
    }
  };

  let triggerEdit = async (e) => {
    e.preventDefault();

    setShowMessage(
      <form onSubmit={updateMessage}>
        <textarea
          name="messageContent"
          defaultValue={showMessage.props.children}
          onKeyPress={PressEnter}
        ></textarea>
        {/* <input type="text" name="messageContent" defaultValue={showMessage} /> */}
      </form>
    );

    setBtn("CANCEL");

    return;
  };

  let triggerCancel = async (e) => {
    setShowMessage(<p className="show-space">{message.content}</p>);
    setBtn("EDIT");
  };

  let PressEnter = async (e) => {
    if (e.key === "Enter" && e.shiftKey == false) {
      updateMessage(e);
    }
  };

  let updateMessage = async (e) => {
    e.preventDefault();

    let form = await {
      user: message.user,
      room: message.room,
      content: e.target.value,
    };

    let response = await fetch(
      `http://127.0.0.1:8000/api/update-message/${message.id}/`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + String(authTokens.access),
        },
        body: JSON.stringify(form),
      }
    );
    let data = await response.json();
    if (response.ok) {
      setShowMessage(<p className="show-space">{message.content}</p>);
      setBtn("EDIT");
      chatSocket.send(JSON.stringify({ ...data, method: "EDIT" }));
    }
  };

  let getUser = async (id) => {
    let response = await fetch(`http://127.0.0.1:8000/api/get-user/${id}/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + String(authTokens.access),
      },
    });
    let data = await response.json();
  };

  return visible ? (
    <div className="message">
      <div className="wrapper">
        <div className="message-header">
          <img src={process.env.PUBLIC_URL + dict?.avatar} alt="avatar" />
          {/* <small>{dict?.avatar}</small> */}
          <small>@{dict?.username} </small>
          <small>#{message?.timeago}</small>
        </div>
        <div className="message-content">{showMessage}</div>
      </div>
      <div className="btn">
        {user?.user_id === message?.user ? (
          <>
            <button
              className={btn === "EDIT" ? "edit pointer" : "cancel pointer"}
              onClick={btn === "EDIT" ? triggerEdit : triggerCancel}
            >
              {btn}
            </button>
            <button className="delete pointer" onClick={deleteMessage}>
              DELETE
            </button>
          </>
        ) : (
          <></>
        )}
      </div>
    </div>
  ) : (
    <div />
  );
};

export default Message;
