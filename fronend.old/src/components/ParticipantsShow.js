import React, { useState, useEffect, useContext } from "react";

import { AuthContext } from "../context/AuthContext";

const ParticipantsShow = ({ roomId }) => {
  let [participants, setParticipants] = useState([]);
  let { user, authTokens } = useContext(AuthContext);

  useEffect(() => {
    getParticipants();
  }, []);

  let getParticipants = async () => {
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
    console.log(`getParticipants: ${JSON.stringify(data)}`);
    setParticipants(data);
  };

  return (
    <div className="participants-show">
      <h1>participants</h1>
      {participants.map((participant, index) => (
        <h3 key={participant.id}>{participant.username}</h3>
      ))}
    </div>
  );
};

export default ParticipantsShow;
