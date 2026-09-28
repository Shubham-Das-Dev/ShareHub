import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext";

const getStoredUsers = () => {
  const storedUsers = JSON.parse(localStorage.getItem("users"));
  if (Array.isArray(storedUsers)) return storedUsers;

  const legacyUser = JSON.parse(localStorage.getItem("user"));
  if (legacyUser && typeof legacyUser === "object") {
    const migratedUsers = [legacyUser];
    localStorage.setItem("users", JSON.stringify(migratedUsers));
    return migratedUsers;
  }

  return [];
};

const AdminUsers = () => {
  const { isLoggedIn, user, setIsLoggedIn, setRole, setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [users, setUsers] = useState(getStoredUsers);

  useEffect(() => {
    const refreshUsers = () => setUsers(getStoredUsers());
    window.addEventListener("sharehubDataUpdated", refreshUsers);
    window.addEventListener("storage", refreshUsers);
    return () => {
      window.removeEventListener("sharehubDataUpdated", refreshUsers);
      window.removeEventListener("storage", refreshUsers);
    };
  }, []);

  const removeUser = (index) => {
    if (!window.confirm("Are you sure you want to remove this user?")) return;
    const deletedUser = users[index];
    const updatedUsers = users.filter((_, userIndex) => userIndex !== index);
    localStorage.setItem("users", JSON.stringify(updatedUsers));
    setUsers(updatedUsers);
    window.dispatchEvent(new Event("sharehubDataUpdated"));

    // Check if the deleted user is the currently logged-in user
    if (isLoggedIn && deletedUser?.email === user?.email) {
      // Clear authentication state
      setIsLoggedIn(false);
      setRole("");
      setUser(null);
      // Redirect to login
      navigate("/login");
    }
  };

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">Manage Users</h1>
      {users.length ? (
        <div className="table-responsive">
          <table className="table table-hover align-middle bg-white shadow-sm">
            <thead className="table-success">
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={`${user.email}-${index}`}>
                  <td>
                    {user.name || user.organizationName || "Not provided"}
                  </td>
                  <td>{user.email || "Not provided"}</td>
                  <td className="text-capitalize">
                    {user.role || "Not provided"}
                  </td>
                  <td>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => removeUser(index)}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-center mt-4">No users registered.</p>
      )}
    </div>
  );
};

export default AdminUsers;
