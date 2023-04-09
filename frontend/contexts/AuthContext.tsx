import { createContext, useState, useEffect, FC } from "react";
import jwt_decode from "jwt-decode";
import { useRouter } from "next/router";
import { User } from "@/types/User";
import { AuthContextType } from "@/types/AuthContextType";
import { Token } from "@/types/Token";

import { getCookie, setCookie, deleteCookie } from "cookies-next";

export const AuthContext = createContext<AuthContextType>({
  user: undefined,
  token: undefined,
  login: () => {},
  logout: () => {},
  register: () => {},
});

export function initAuthContext() {}

export const AuthProvider: FC<any> = ({ children }) => {
  const router = useRouter();

  const [user, setUser] = useState<User>();
  const [token, setToken] = useState<Token>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const tokenData = getCookie("token");
    if (typeof tokenData == "string") {
      setToken(JSON.parse(tokenData));
      setUser(jwt_decode(tokenData));
    }
  }, []);

  async function login(inputData: object) {
    console.log("login()");
    const res = await fetch(`http://127.0.0.1:8000/api/token/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(inputData),
    });

    const data: Token = await res.json();

    if (res.ok) {
      setToken(data);
      setUser(jwt_decode(data.access));
      setCookie("token", JSON.stringify(data));
      router.push("/");
    } else {
      alert("Something went wrong!" + res.statusText);
    }
  }

  async function register(inputData: object) {
    const res = await fetch(`http://127.0.0.1:8000/api/users/`, {
      method: "POST",
      body: JSON.stringify(inputData),
    });

    // const data: User = await res.json();

    if (res.ok) {
      router.push("/login");
    } else {
      alert("Something went wrong!");
    }
  }

  async function logout() {
    setToken(undefined);
    setUser(undefined);
    deleteCookie("token");
    router.push("/login");
  }

  async function updateToken() {
    if (!token) return;
    const res = await fetch(`http://127.0.0.1:8000/api/token/refresh/`, {
      method: "POST",
      body: JSON.stringify({ refresh: token.refresh }),
    });

    const data: Token = await res.json();

    if (res.ok) {
      setToken(data);
      setUser(jwt_decode(data.access));
      setCookie("token", JSON.stringify(data));
    } else {
      logout();
    }
  }

  useEffect(() => {
    if (loading) {
      updateToken();
      setLoading(false);
    }

    const fourMinutes = 4 * 60 * 1000;
    const interval = setInterval(() => {
      if (token) {
        updateToken();
      }
    }, fourMinutes);

    return () => clearInterval(interval);
  }, [token, loading]);

  const contextData = {
    user: user,
    token: token,
    login: login,
    logout: logout,
    register: register,
  };

  return (
    <AuthContext.Provider value={contextData}>
      {loading ? null : children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
