// routes.tsx
import { createBrowserRouter } from "react-router";
import { Landing } from "./pages/Landing";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { CitizenDashboard } from "./pages/CitizenDashboard";
import { RecyclingMap } from "./pages/RecyclingMap";
import { FormulariosReciclaje } from "./pages/FormulariosReciclaje";
import { Guides } from "./pages/Guides";
import { CitizenProfile } from "./pages/CitizenProfile";
import { AdminDashboard } from "./pages/AdminDashboard";
import { AdminUsers } from "./pages/AdminUsers";
import { MaintainerDashboard } from "./pages/MaintainerDashboard";
import { ManagePoints } from "./pages/ManagePoints";
import { DashboardLayout } from "./components/DashboardLayout";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Landing,
  },
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/registro",
    Component: Register,
  },
  {
    path: "/ciudadano",
    Component: DashboardLayout,
    children: [
      { index: true, Component: CitizenDashboard },
      { path: "mapa", Component: RecyclingMap },
      { path: "formularios", Component: FormulariosReciclaje },
      { path: "guias", Component: Guides },
      { path: "perfil", Component: CitizenProfile },
    ],
  },
  {
    path: "/admin",
    Component: DashboardLayout,
    children: [
      { index: true, Component: AdminDashboard },
      { path: "usuarios", Component: AdminUsers },
      { path: "puntos", Component: ManagePoints },
    ],
  },
  {
    path: "/mantenedor",
    Component: DashboardLayout,
    children: [
      { index: true, Component: MaintainerDashboard },
    ],
  },
]);