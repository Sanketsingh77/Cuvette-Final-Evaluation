import React, { createContext, useState, useEffect } from "react";
import Loader from "../components/loaders/Loader";
import { Outlet, useNavigate } from "react-router-dom";
import Appbar from "../components/appbar/Appbar";
import userApi from "..//./api/getUserdata";
export const LoadingContext = createContext();
function Applayout() {
  const [loading, setloading] = useState(false);
  const [loggedIn, setloggedIn] = useState(false);
  const [user, setuser] = useState(null);
  const [trigger, settrigger] = useState(0);
  const contextValues = {
    setloading,
    settrigger,
    user,
    loggedIn,
    setloggedIn,
  };
  const checkAuth = async () => {
    setloading(true);
    try {
      const response = await userApi.getUserData();
      if (response?.message == "logged") {
        setloggedIn(true);
        setloading(false);
        setuser(response.username);
      } else {
        setloggedIn(false);
        setloading(false);
      }
    } catch (error) {
      setloading(false);
    }
  };
  useEffect(() => {
    checkAuth();
  }, [loggedIn]);
  return (
    <div style={{ display: "flex" }}>
      <LoadingContext.Provider value={contextValues}>
        <Loader active={loading}>
          <Appbar />
          {<Outlet />}
        </Loader>
      </LoadingContext.Provider>
    </div>
  );
}

export default Applayout;
