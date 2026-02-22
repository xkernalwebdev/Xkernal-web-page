import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const cached = localStorage.getItem("xk_user");
    return cached ? JSON.parse(cached) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem("xk_token"));
  const [loading, setLoading] = useState(false);

  const login = (userData, jwtToken) => {
    setUser(userData);
    setToken(jwtToken);
    localStorage.setItem("xk_user", JSON.stringify(userData));
    localStorage.setItem("xk_token", jwtToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("xk_user");
    localStorage.removeItem("xk_token");
  };

  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem("xk_user", JSON.stringify(userData));
  };

  return (
    <AuthContext.Provider
      value={{ user, token, login, logout, loading, setLoading, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
