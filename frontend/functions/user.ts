import { Token } from "@/types/Token";
import { User } from "@/types/User";

// export async function createUser(body: object) {
//   const res = await fetch(`http://127.0.0.1:8000/api/users/`, {
//     method: "POST",
//     body: JSON.stringify(body),
//   });

//   const data: User = await res.json();

//   if (res.ok) {
//     console.log("createUser: ", data);
//     return data;
//   } else {
//     throw new Error(res.statusText);
//   }
// }

// export async function getUser(id: number, token: Token) {
//   const res = await fetch(`http://127.0.0.1:8000/api/users/${id}/`, {
//     method: "GET",
//     headers: {
//       Authorization: "Bearer " + String(token.access),
//     },
//   });

//   const data: User = await res.json();

//   if (res.ok) {
//     console.log("getUser: ", data);
//     return data;
//   } else {
//     throw new Error(res.statusText);
//   }
// }

// export async function updateUser(id: number, body: , token: Token) {
//   const res = await fetch(`http://127.0.0.1:8000/api/users/${id}/`, {
//     method: "PATCH",
//     headers: {
//       Authorization: "Bearer " + String(token.access),
//     },
//   });

//   const data: User = await res.json();

//   if (res.ok) {
//     console.log("updateUser: ", data);
//     return data;
//   } else {
//     throw new Error(res.statusText);
//   }
// }

// export async function createUser = createFetch();
