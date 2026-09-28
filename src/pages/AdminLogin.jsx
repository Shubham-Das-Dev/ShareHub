import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext";

const AdminLogin = () => {
  const { setIsLoggedIn, setRole } = useContext(AuthContext);
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();

  const onSubmit = (data) => {
    if (data.email === "admin@sharehub.com" && data.password === "admin123") {
      setIsLoggedIn(true);
      setRole("admin");
      navigate("/admin");
    } else {
      alert("Invalid admin credentials");
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center">Admin Login</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
        <div className="mb-3">
          <label>Email</label>
          <input type="email" className="form-control" {...register("email")} />
        </div>

        <div className="mb-3">
          <label>Password</label>
          <div className="input-group">
            <input
              type={showPassword ? "text" : "password"}
              className="form-control"
              {...register("password")}
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
        </div>

        <button className="btn btn-danger">Admin Login</button>
      </form>
    </div>
  );
};

export default AdminLogin;
