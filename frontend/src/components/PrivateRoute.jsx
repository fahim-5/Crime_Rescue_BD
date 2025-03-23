import React from "react";
import { Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

const PrivateRoute = ({ element, ...rest }) => {
  const { user } = useAuth();

  return (
    <Route
      {...rest}
      element={user ? element : <Navigate to="/login" />}
    />
  );
};

export default PrivateRoute;
