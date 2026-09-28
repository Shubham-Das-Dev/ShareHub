import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
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

const Login = () => {
  const { setIsLoggedIn, setRole, setUser } = useContext(AuthContext);
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();

  const onSubmit = (data) => {
    const users = getStoredUsers();
    const user = users.find(
      (storedUser) =>
        storedUser.email?.toLowerCase() === data.email.toLowerCase() &&
        storedUser.password === data.password,
    );

    if (!user) {
      alert("Invalid email or password.");
      return;
    }

    setIsLoggedIn(true);
    setRole(user.role);
    setUser(user);
    navigate("/");
  };

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">Login</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="col-md-6 mx-auto">
        <input
          type="email"
          placeholder="Email"
          className="form-control mb-3"
          {...register("email", { required: "Email is required" })}
        />
        {errors.email && <p className="text-danger">{errors.email.message}</p>}
        <div className="input-group mb-3">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="form-control"
            {...register("password", { required: "Password is required" })}
          />
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? "🙈" : "👁"}
          </button>
        </div>
        {errors.password && (
          <p className="text-danger">{errors.password.message}</p>
        )}
        <button type="submit" className="btn btn-success">
          Login
        </button>
      </form>
    </div>
  );
};
export default Login;
