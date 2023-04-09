import React, { useState, useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Navbar from "../components/Navbar";

import { ReactComponent as ArrowLeft } from "../assets/arrow-left.svg";
import { Link } from "react-router-dom";

const RoomSettingPage = () => {
  let [room, setRoom] = useState({});
  let navigate = useNavigate();
  let { authTokens, user } = useContext(AuthContext);
  let roomId = useLocation().pathname.slice(1, 2);

  useEffect(() => {
    getRoom();
  }, []);

  let getRoom = async () => {
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
    // console.log(data)
  };

  let leaveRoom = async () => {
    let check = window.confirm("Are you sure you wanna leave this room?");
    if (check) {
      let response = await fetch(
        `http://127.0.0.1:8000/api/leave-room/${roomId}/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + String(authTokens.access),
          },
        }
      );

      if (response.ok) {
        navigate(`/`);
      } else {
        alert("sth went wrong");
      }
    }
  };

  let deleteRoom = async (e) => {
    e.preventDefault();

    let check = window.confirm("Are you sure you wanna delete this room?");
    if (check) {
      let response = await fetch(
        `http://127.0.0.1:8000/api/delete-room/${roomId}/`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + String(authTokens.access),
          },
        }
      );

      let data = await response.json();

      if (response.ok) {
        navigate(`/`);
      } else {
        alert("sth went wrong");
      }
    }
  };

  return (
    <>
      <div className="nav-bar">
        <Link to={String(`/${roomId}/`)}>
          <ArrowLeft className="arrow-left" />
        </Link>
        <div>
          {user?.user_id == room?.host ? (
            <button
              onClick={(e) => {
                deleteRoom(e);
              }}
            >
              Delete Room
            </button>
          ) : (
            <div></div>
          )}
          <button
            onClick={(e) => {
              leaveRoom(e);
            }}
          >
            Leave Room
          </button>
        </div>
      </div>
      <div className="login-page">
        {user?.user_id == room?.host ? (
          <form>
            <div className="login-form">
              <div className="wrapper">
                <label>topic: </label>
                <input
                  type="text"
                  name="topic"
                  placeholder="topic"
                  defaultValue={room.topic}
                />
              </div>
              <input className="pointer" type="submit" value="Update" />
            </div>
          </form>
        ) : (
          <></>
        )}
      </div>
    </>
  );
};

export default RoomSettingPage;
