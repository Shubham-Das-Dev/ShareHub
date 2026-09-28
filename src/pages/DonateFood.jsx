import { useContext } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { AuthContext } from "../AuthContext";

const DonateFood = () => {
  const { isLoggedIn, role, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({ defaultValues: { category: "Food" } });

  const onSubmit = (data) => {
    if (!isLoggedIn || role !== "donor") {
      alert("Please log in first to donate a resource.");
      return;
    }
    const saveDonation = (image = "") => {
      const resource = { ...data };
      delete resource.image;
      const donations = JSON.parse(localStorage.getItem("donations")) || [];
      const resourceId = `resource-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      localStorage.setItem(
        "donations",
        JSON.stringify([
          ...donations,
          {
            ...resource,
            image,
            resourceId,
            status: "Pending Approval",
            donorEmail: user?.email || "",
            donorName: user?.name || "",
          },
        ]),
      );
      window.dispatchEvent(new Event("sharehubDataUpdated"));
      alert("Resource shared successfully!");
      reset({ category: "Food" });
      navigate("/my-donations");
    };
    const file = data.image?.[0];
    if (!file) {
      saveDonation();
      return;
    }
    const reader = new FileReader();
    reader.onload = () => saveDonation(reader.result);
    reader.readAsDataURL(file);
  };

  return (
    <section className="container page-section">
      <div className="form-panel mx-auto">
        <span className="section-kicker">Make an impact</span>
        <h1>Donate Resources</h1>
        <p className="text-muted mb-4">
          Share useful surplus with organizations in your community.
        </p>
        <form onSubmit={handleSubmit(onSubmit)} className="row g-3">
          <div className="col-md-7">
            <label className="form-label">Resource Name</label>
            <input
              className="form-control"
              placeholder="e.g. Winter jackets"
              {...register("itemName", {
                required: "Resource name is required",
              })}
            />
            {errors.itemName && (
              <small className="text-danger">{errors.itemName.message}</small>
            )}
          </div>
          <div className="col-md-5">
            <label className="form-label">Category</label>
            <select
              className="form-select"
              {...register("category", { required: true })}
            >
              <option>Food</option>
              <option>Clothes</option>
              <option>Books</option>
              <option>Stationery</option>
              <option>Other</option>
            </select>
          </div>
          <div className="col-md-5">
            <label className="form-label">Quantity</label>
            <input
              className="form-control"
              placeholder="e.g. 10 items"
              {...register("quantity", { required: "Quantity is required" })}
            />
            {errors.quantity && (
              <small className="text-danger">{errors.quantity.message}</small>
            )}
          </div>
          <div className="col-md-7">
            <label className="form-label">Donor / Pickup Location</label>
            <input
              className="form-control"
              placeholder="Area, City"
              {...register("place", { required: "Location is required" })}
            />
            {errors.place && (
              <small className="text-danger">{errors.place.message}</small>
            )}
          </div>
          <div className="col-12">
            <label className="form-label">Description</label>
            <textarea
              className="form-control"
              rows="3"
              placeholder="Describe the resource and its condition"
              {...register("description")}
            />
          </div>
          <div className="col-12">
            <label className="form-label">
              Image <span className="text-muted fw-normal">(optional)</span>
            </label>
            <input
              type="file"
              accept="image/*"
              className="form-control"
              {...register("image")}
            />
          </div>
          <div className="col-12">
            {isLoggedIn && role === "donor" ? (
              <button type="submit" className="btn btn-success px-4">
                Share Resource
              </button>
            ) : (
              <div>
                <Link to="/login" className="btn btn-success px-4">
                  Login to Donate
                </Link>
              </div>
            )}
          </div>
        </form>
      </div>
    </section>
  );
};
export default DonateFood;

