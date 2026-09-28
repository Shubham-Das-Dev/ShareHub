import { useContext } from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { AuthContext } from "../AuthContext";

const Navbar = () => {
  const { isLoggedIn, setIsLoggedIn, role, setRole, user, setUser } =
    useContext(AuthContext);
  const logout = () => {
    setIsLoggedIn(false);
    setRole("");
    setUser(null);
  };
  const resourceLink = (
    <li className="nav-item">
      <Link className="nav-link" to="/available-food">
        Available Resources
      </Link>
    </li>
  );
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-success shadow-sm">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/">
          ShareHub
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#sharehubNavbar"
        >
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="sharehubNavbar">
          <ul className="navbar-nav ms-auto align-items-lg-center gap-lg-1">
            {isLoggedIn && user?.name && (
              <li className="nav-item">
                <span className="nav-link greeting">Hello, {user.name}</span>
              </li>
            )}
            {isLoggedIn && role === "donor" && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/">
                    Home
                  </Link>
                </li>
                {resourceLink}
                <li className="nav-item">
                  <Link className="nav-link" to="/donor-dashboard">
                    Dashboard
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/donate-food">
                    Donate Resources
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/my-donations">
                    My Donations
                  </Link>
                </li>
              </>
            )}
            {isLoggedIn && role === "organization" && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/">
                    Home
                  </Link>
                </li>
                {resourceLink}
                <li className="nav-item">
                  <Link className="nav-link" to="/organization-dashboard">
                    Dashboard
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/my-requests">
                    My Requests
                  </Link>
                </li>
              </>
            )}
            {!isLoggedIn && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/">
                    Home
                  </Link>
                </li>
                {resourceLink}
                <li className="nav-item">
                  <Link className="nav-link" to="/donate-food">
                    Donate Resources
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/register">
                    Register
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">
                    Login
                  </Link>
                </li>
              </>
            )}
            {isLoggedIn && role !== "admin" && (
              <li className="nav-item">
                <button
                  className="nav-link border-0 bg-transparent"
                  onClick={logout}
                >
                  Logout
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};
export default Navbar;
