import { createBrowserRouter } from "react-router-dom";
import Layout from "./Layout";
import Home from "./Home";
import AvailableFood from "./AvailableFood";
import DonateFood from "./DonateFood";
import Register from "./Register";
import Login from "./Login";
import MyDonations from "./MyDonations";
import MyRequests from "./MyRequest";
import DonorDashboard from "./DonorDashboard";
import OrganizationDashboard from "./OrganizationDashboard";
import AdminLayout from "./AdminLayout";
import AdminDashboard from "./AdminDashboard";
import AdminUsers from "./AdminUsers";
import AdminLogin from "./AdminLogin";
import AdminFood from "./AdminFood.jsx";
import AdminRequests from "./AdminRequests";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "available-food",
        element: <AvailableFood />,
      },
      {
        path: "donate-food",
        element: <DonateFood />,
      },

      {
        path: "register",
        element: <Register />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "my-donations",
        element: <MyDonations />,
      },
      {
        path: "my-requests",
        element: <MyRequests />,
      },
      {
        path: "donor-dashboard",
        element: <DonorDashboard />,
      },
      {
        path: "organization-dashboard",
        element: <OrganizationDashboard />,
      },
    ],
  },
  {
    path: "/admin-login",
    element: <AdminLogin />,
  },
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      {
        index: true,
        element: <AdminDashboard />,
      },
      {
        path: "users",
        element: <AdminUsers />,
      },
      {
        path: "food",
        element: <AdminFood />,
      },
      {
        path: "requests",
        element: <AdminRequests />,
      },
    ],
  },
]);

export default router;
