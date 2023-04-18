import { Token } from "@/types/Token";

export async function fetchData(
  path: string,
  method: string,
  body: object,
  token: Token | undefined
) {
  const res = await fetch(`http://127.0.0.1:8000/api/${path}`, {
    method: method,
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? "Bearer " + token.access : "",
    },
    body: Object.keys(body).length == 0 ? null : JSON.stringify(body),
  });

  const data = res.json();

  if (res.ok) {
    return data;
  } else {
    throw new Error(res.statusText);
  }
}
