import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebaseConfig";
import User from "./layouts/User";
import Admin from "./layouts/Admin";
import Auth from "./layouts/Auth";
import { isAdmin } from "/src/utils";

const App = () => {
  const [signedInUser, setSignedInUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setSignedInUser(user);
      } else {
        setSignedInUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Navigate to={signedInUser ? (isAdmin(signedInUser) ? "/admin/dashboard" : "/user/home") : "/auth/login"} />} />
      <Route path="/auth/*" element={<Auth />} />
      <Route path="/user/*" element={<User />} />
      {signedInUser && isAdmin(signedInUser) && (
        <Route path="/admin/*" element={<Admin />} />
      )}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default App;
