import { Token } from "@/types/Token";

export function createFetch(
  hasId: number = -1,
  hasToken: Token | undefined = undefined,
  method: string,
  path: string,
  funcName: string
) {
  return async (
    id: number = -1,
    body: object = {},
    token: Token | undefined = undefined
  ) => {
    let url = `http://127.0.0.1:8000/api/${path}/` + (hasId ? `${id}/` : "");

    let tokenStr = hasToken ? "Bearer " + String(token?.access) : "";

    const res = await fetch(url, {
      method: method,
      headers: { Authorization: tokenStr },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (res.ok) {
      console.log(funcName + ": ", data);
      return data;
    } else {
      throw new Error(res.statusText);
    }
  };
}

// export async function useFetch(
//   id: number,
//   body: object,
//   token: Token | undefined
// ) {}
