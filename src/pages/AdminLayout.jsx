import { useContext, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext";
import AdminNavbar from "./AdminNavbar";
import Footer from "../components/Footer";

const AdminLayout = () => {
  const { isLoggedIn, role } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn || role !== "admin") {
      navigate("/admin-login");
    }
  }, [isLoggedIn, role, navigate]);

  if (!isLoggedIn || role !== "admin") {
    return null;
  }

  return (
    <div className="d-flex flex-column min-vh-100">
      <AdminNavbar />
      <main className="flex-grow-1" style={{ paddingTop: '85px' }}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default AdminLayout;
