import React, { useState, useEffect, useContext } from "react";

import Sidebar from "../components/Sidebar";
import ChatBody from "../components/ChatBody";

import { AuthContext } from "../context/AuthContext";

const HomePage = () => {

  return (
    <div className="home-page">
      <Sidebar />
      <div className="blank-room"></div>
    </div>
  );
};

export default HomePage;
