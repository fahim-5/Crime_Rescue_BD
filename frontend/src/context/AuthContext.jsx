// src/context/AuthContext.jsx

import React, { createContext, useState, useEffect } from "react";

// Create the AuthContext
export const AuthContext = createContext();

// AuthContext Provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Simulate a user login state (this could come from localStorage, API, etc.)
  useEffect(() => {
    const storedUser = localStorage.getItem("user"); // Or fetch user data from an API
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Define login and logout functions
  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData)); // Save user to localStorage
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user"); // Remove user from localStorage
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
