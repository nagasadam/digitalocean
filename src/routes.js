import {Dashboard} from "./pages/Dashboard";
import {Profile} from "./pages/Profile.js";
import {Group} from "./pages/Group.js";
import {Login} from "./pages/login";
import {Survey} from "./pages/Surveys";
import {SurveyEdit} from "./pages/SurveyEdit.jsx";
import { SurveyResult } from "./pages/SurveyResult";
import { Scan } from "./pages/Scan";
import { Register } from "./pages/Register";

const routes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: "ni ni-tv-2 text-primary",
    component: Dashboard,
    layout: "/admin"
  },
  {
    path: "/group",
    name: "Question Bank",
    icon: "ni ni-badge text-red",
    component: Group,
    layout: "/admin"
  },
  {
    path: "/surveys",
    name: "Survey",
    icon: "ni ni-bullet-list-67 text-green",
    component: Survey,
    layout: "/admin"
  },
  {
    path: "/survey/edit",
    name: "Edit Survey",
    icon: "ni ni-bullet-list-67 text-black",
    component: SurveyEdit,
    layout: "/admin"
  },
  {
    path: "/survey/add",
    name: "Create Survey",
    icon: "ni ni-bullet-list-67 text-green",
    component: SurveyEdit,
    layout: "/admin"
  },
  {
    path: "/survey/result",
    name: "Survey Results",
    icon: "ni ni-bullet-list-67 text-blue",
    component: SurveyResult,
    layout: "/admin"
  },
  {
    path: "/user",
    name: "User Profile",
    icon: "ni ni-single-02 text-yellow",
    component: Profile,
    layout: "/admin"
  },
  {
    path: "/login",
    name: "Login",
    icon: "ni ni-key-25 text-info",
    component: Login,
    layout: "/auth"
  },
  {
    path: "/signup",
    name: "Sign Up",
    icon: "ni ni-key-25 text-info",
    component: Register,
    layout: "/auth" 
  },
  {
    path: "/scan",
    name: "Scan",
    icon: "ni ni-key-25 text-info",
    component: Scan,
    layout: "/auth" 
  }
];

export default routes