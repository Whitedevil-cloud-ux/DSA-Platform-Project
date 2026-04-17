import { createContext, useState, useEffect } from "react";
import api from "../services/api";

export const AuthContext = createContext();

const getStoredUser = () => {
  const storedUser = localStorage.getItem("user");

  if (!storedUser || storedUser === "undefined") {
    localStorage.removeItem("user");
    return null;
  }

  try {
    return JSON.parse(storedUser);
  } catch (error) {
    console.error("Invalid stored user:", error);
    localStorage.removeItem("user");
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const parsedUser = getStoredUser();
    if (parsedUser) {
      setUser(parsedUser);
    }
  }, []);

  const login = async (email, password) => {
    const res = await api.post("/login", { email, password });
    const { token, user } = res.data.data;

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));

    setUser(user);
  };

  const signup = async (data) => {
    const res = await api.post("/signup", data);
    const { token, user } = res.data.data;

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));

    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
