import { createContext, useState, useEffect } from "react";

// eslint-disable-next-line react-refresh/only-export-components
const AuthContext = createContext();
function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const handleStorageChange = (event) => {
      // Only respond to changes to the users array
      if (event.key === "users") {
        const updatedUsers = JSON.parse(event.newValue || "[]");
        // If there's a logged-in user and their email is no longer in the users array, log them out
        if (isLoggedIn && user?.email) {
          const userStillExists = updatedUsers.some(
            (u) => u.email === user.email
          );
          if (!userStillExists) {
            setUser(null);
            setIsLoggedIn(false);
            setRole("");
          }
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [isLoggedIn, user]);

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, setIsLoggedIn, role, setRole, user, setUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}
export { AuthContext, AuthProvider };
