import {useEffect} from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import routes from "../Routes";

const Auth = () => {

useEffect(() => {
    console.log("auth")
  }, []);


  const getRoutes = (_routes) => {
    return _routes.map((route, key) => {
      if (route.layout === "/auth") {
        console.log(route);
        
        return (
          <Route
            key={key}
            path={route.path}
            element={<route.component />}
            exact
          />
        );
      } else {
        return null;
      }
    });
  };

  return (
    <>
      <Routes>
        {getRoutes(routes.common)}
        <Route path="*" element={<Navigate to="/auth/login" />} />
        {/* <Route path="/signup" element={<Navigate to="/auth/signup" />} /> */}
      </Routes>
    </>
  );
};

export default Auth;
