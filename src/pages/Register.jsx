import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

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

const Register = () => {
  const [role, setRole] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm();

  const onSubmit = (data) => {
    const users = getStoredUsers();
    const emailExists = users.some(
      (user) => user.email?.toLowerCase() === data.email.toLowerCase(),
    );

    if (emailExists) {
      alert("An account with this email already exists.");
      return;
    }

    localStorage.setItem("users", JSON.stringify([...users, data]));
    window.dispatchEvent(new Event("sharehubDataUpdated"));
    navigate("/login");
  };

  return (
    <section className="container page-section">
      <div className="form-panel mx-auto">
        <span className="section-kicker">Join the community</span>
        <h1>Register</h1>
        <p className="text-muted mb-4">
          Create an account to share or request resources.
        </p>
        <form onSubmit={handleSubmit(onSubmit)} className="row g-3">
          <div className="col-12">
            <label className="form-label">Full Name</label>
            <input
              className="form-control"
              placeholder="Your name"
              {...register("name", {
                required: "Name is required",
                minLength: {
                  value: 3,
                  message: "Name must be at least 3 characters",
                },
              })}
            />
            {errors.name && (
              <small className="text-danger">{errors.name.message}</small>
            )}
          </div>
          <div className="col-12">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              placeholder="you@example.com"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Enter a valid email",
                },
              })}
            />
            {errors.email && (
              <small className="text-danger">{errors.email.message}</small>
            )}
          </div>
          <div className="col-md-6">
            <label className="form-label">Password</label>
            <div className="input-group">
              <input
                type={showPassword ? "text" : "password"}
                className="form-control"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
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
              <small className="text-danger">{errors.password.message}</small>
            )}
          </div>
          <div className="col-md-6">
            <label className="form-label">Confirm Password</label>
            <div className="input-group">
              <input
                type={showConfirmPassword ? "text" : "password"}
                className="form-control"
                {...register("confirmPassword", {
                  required: "Confirm your password",
                  validate: (value) =>
                    value === getValues("password") || "Passwords do not match",
                })}
              />
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                aria-label={
                  showConfirmPassword
                    ? "Hide confirm password"
                    : "Show confirm password"
                }
              >
                {showConfirmPassword ? "🙈" : "👁"}
              </button>
            </div>
            {errors.confirmPassword && (
              <small className="text-danger">
                {errors.confirmPassword.message}
              </small>
            )}
          </div>
          <div className="col-12">
            <label className="form-label">I am registering as</label>
            <select
              className="form-select"
              {...register("role", {
                required: "Please select a role",
                onChange: (event) => setRole(event.target.value),
              })}
            >
              <option value="">Select Role</option>
              <option value="donor">Donor</option>
              <option value="organization">Organization</option>
            </select>
            {errors.role && (
              <small className="text-danger">{errors.role.message}</small>
            )}
          </div>
          {role === "organization" && (
            <>
              <div className="col-md-6">
                <label className="form-label">Organization Name</label>
                <input
                  className="form-control"
                  {...register("organizationName", {
                    required: "Organization name is required",
                  })}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Organization Type</label>
                <select
                  className="form-select"
                  {...register("organizationType", {
                    required: "Organization type is required",
                  })}
                >
                  <option value="">Select type</option>
                  <option>NGO</option>
                  <option>School / College</option>
                  <option>Community Group</option>
                  <option>Charity</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="col-12">
                <label className="form-label">Organization Location</label>
                <input
                  className="form-control"
                  placeholder="Area, City"
                  {...register("organizationLocation", {
                    required: "Organization location is required",
                  })}
                />
              </div>
            </>
          )}
          <div className="col-12">
            <button type="submit" className="btn btn-success px-4">
              Create Account
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};
export default Register;
