import Login from "../views/auth/Login";
import Signup from "../views/auth/Signup";
import Home from "../views/Home/Home";
import Cart from "../components/Cart/Cart";
import MyProfile from "../components/MyProfile/MyProfile";
import Dashboard from "../views/Dashboard/Dashboard";

const routes = [
  {
    path: "/home",
    name: "Home",
    icon: "N/A",
    component: Home,
    layout: "/user",
    display: true,
  },
  
  {
    path: "/myprofile",
    name: "myprofile",
    icon: "N/A",
    component: MyProfile,
    layout: "/user",
    display: true,
  },
  {
    path: "/cart",
    name: "cart",
    icon: "N/A",
    component: Cart,
    layout: "/user",
    display: true,
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: "N/A",
    component: Dashboard,
    layout: "/admin",
    display: true,
  },
  {
    path: "/login",
    name: "Login",
    icon: "N/A",
    component: Login,
    layout: "/auth",
    display: false,
  },
  {
    path: "/signup",
    name: "Signup",
    icon: "N/A",
    component: Signup,
    layout: "/auth",
    display: false,
  },
];

export default routes;
