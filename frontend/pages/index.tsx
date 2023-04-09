import RoomSideBar from "@/components/RoomSideBar";
import UserSideBar from "@/components/UserSideBar";
import Head from "next/head";
import Image from "next/image";

import styles from "./index.module.css";
import { useContext } from "react";
import { AuthContext } from "@/contexts/AuthContext";
import { getRooms } from "@/functions/room";
import { getCookie } from "cookies-next";
import { Context } from "vm";
import { Token } from "@/types/Token";
import { Room } from "@/types/Room";

function Home({ token, rooms }: any) {
  return (
    <>
      <Head>
        <title>Chat App</title>
        <meta name="description" content="A cool Chat App" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div className={styles.homepage}>
          <RoomSideBar rooms={rooms} />
          <div className="chat">Chat Panel</div>
          <UserSideBar />
        </div>
      </main>
    </>
  );
}

export async function getServerSideProps(ctx: Context) {
  const tokenCookie = getCookie("token", ctx);

  if (typeof tokenCookie != "string") {
    return { props: {} };
  }

  const token: Token = JSON.parse(tokenCookie);
  let rooms: Room[] = [];

  try {
    rooms = await getRooms(token);
  } catch (error) {
    alert(error);
  }

  return { props: { token, rooms } };
}

export default Home;
