import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../AuthContext";

const AdminNavbar = () => {
  const { setIsLoggedIn, setRole } = useContext(AuthContext);

  return (
    <nav className="navbar navbar-expand-lg bg-success">
      <div className="container">
        <Link className="navbar-brand text-white fw-bold" to="/admin">
          ShareHub Admin
        </Link>

        <ul className="navbar-nav ms-auto">
          <li className="nav-item">
            <Link className="nav-link text-white" to="/admin">
              Dashboard
            </Link>
          </li>

          <li className="nav-item">
            <Link className="nav-link text-white" to="/admin/users">
              Manage Users
            </Link>
          </li>

          <li className="nav-item">
            <Link className="nav-link text-white" to="/admin/food">
              Manage Resources
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link text-white" to="/admin/requests">
              Manage Resource Requests
            </Link>
          </li>

          <li className="nav-item">
            <button
              className="nav-link text-white border-0 bg-transparent"
              onClick={() => {
                setIsLoggedIn(false);
                setRole("");
              }}
            >
              Logout
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default AdminNavbar;
