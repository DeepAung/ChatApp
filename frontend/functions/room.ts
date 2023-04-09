import { Room } from "@/types/Room";
import { Token } from "@/types/Token";

export async function getRooms(token: Token) {
  const res = await fetch(`http://127.0.0.1:8000/api/rooms/`, {
    method: "GET",
    headers: {
      Authorization: "Bearer " + String(token.access),
    },
  });
  const data: Room[] = await res.json();

  if (res.ok) {
    console.log("getRooms (many): ", data);
    return data;
  } else {
    throw new Error(res.statusText);
  }
}

export async function getRoom(id: number, token: Token) {
  const res = await fetch(`http://127.0.0.1:8000/api/rooms/${id}/`, {
    method: "GET",
    headers: {
      Authorization: "Bearer " + String(token.access),
    },
  });

  const data: Room = await res.json();

  if (res.ok) {
    console.log("getRoom (one): ", data);
    return data;
  } else {
    throw new Error(res.statusText);
  }
}

export async function createRoom(body: object, token: Token) {
  const res = await fetch(`http://127.0.0.1:8000/api/rooms/`, {
    method: "POST",
    headers: {
      Authorization: "Bearer " + String(token.access),
    },
    body: JSON.stringify(body),
  });

  const data: Room = await res.json();

  if (res.ok) {
    console.log("createRoom: ", data);
    return data;
  } else {
    throw new Error(res.statusText);
  }
}

export async function updateRoom(id: number, body: object, token: Token) {
  const res = await fetch(`http://127.0.0.1:8000/api/rooms/${id}`, {
    method: "PATCH",
    headers: {
      Authorization: "Bearer " + String(token.access),
    },
    body: JSON.stringify(body),
  });

  const data: Room = await res.json();

  if (res.ok) {
    console.log("updateRoom: ", data);
    return data;
  } else {
    throw new Error(res.statusText);
  }
}

export async function deleteRoom(id: number, token: Token) {
  const res = await fetch(`http://127.0.0.1:8000/api/rooms/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: "Bearer " + String(token.access),
    },
  });

  if (res.ok) {
    console.log("deleteRoom: ", id);
  } else {
    throw new Error(res.statusText);
  }
}
