import { BrowserRouter, Route, Routes } from "react-router-dom";
import React, { useState, useEffect } from "react";

import HomePage from "./pages/HomePage";
import RoomPage from "./pages/RoomPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProfilePage from "./pages/ProfilePage";
import RoomSettingPage from "./pages/RoomSettingPage";
import CreateRoomPage from "./pages/CreateRoomPage";

import Header from "./components/Header";

import AuthProvider from "./context/AuthContext";
// import SocketProvider from './context/SocketContext'

import "./App.css";

// TODO: delete room as a host
// TODO: create room

function withRouter() {
  function App() {
    const chatSocket = new WebSocket(
      "ws://" +
        "127.0.0.1:8000" +
        "/ws/chat/" +
        window.location.pathname.slice(1, 2) +
        "/"
    );

    useEffect(() => {
      console.log("--------- APP UPDATED ------------");
    }, []);

    return (
      <BrowserRouter>
        <div className="container dark">
          {/* <SocketProvider> */}
          <AuthProvider>
            <Header />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/:id/setting/" element={<RoomSettingPage />} />
              <Route
                path="/:id/"
                element={<RoomPage chatSocket={chatSocket} />}
              />
              <Route path="/login/" element={<LoginPage />} />
              <Route path="/register/" element={<RegisterPage />} />
              <Route path="/profile/" element={<ProfilePage />} />
              <Route path="/create-room/" element={<CreateRoomPage />} />
            </Routes>
          </AuthProvider>
          {/* </SocketProvider> */}
        </div>
      </BrowserRouter>
    );
  }

  return App();
}

export default withRouter;
