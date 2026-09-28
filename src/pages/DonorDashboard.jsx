import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext";

const DonorDashboard = () => {
  const { isLoggedIn, role, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [donations, setDonations] = useState([]);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
      return undefined;
    }
    if (role !== "donor") {
      navigate("/");
      return undefined;
    }
    const refreshDonations = () => {
      const allDonations = JSON.parse(localStorage.getItem("donations")) || [];
      const myDonations = allDonations.filter(
        (donation) => donation.donorEmail === user?.email
      );
      setDonations(myDonations);
    };
    refreshDonations();
    window.addEventListener("sharehubDataUpdated", refreshDonations);
    window.addEventListener("storage", refreshDonations);
    return () => {
      window.removeEventListener("sharehubDataUpdated", refreshDonations);
      window.removeEventListener("storage", refreshDonations);
    };
  }, [isLoggedIn, role, user, navigate]);

  const stats = {
    total: donations.length,
    pending: donations.filter(
      (d) => (d.status || "Available") === "Pending Approval"
    ).length,
    available: donations.filter((d) => (d.status || "Available") === "Available")
      .length,
    accepted: donations.filter((d) => (d.status || "Available") === "Accepted")
      .length,
    rejected: donations.filter((d) => (d.status || "Available") === "Rejected")
      .length,
  };

  const recentDonations = donations.slice(0, 5);

  if (!isLoggedIn || role !== "donor") return null;

  return (
    <section className="container page-section">
      <div className="mb-4">
        <span className="section-kicker">Donor dashboard</span>
        <h1 className="mb-1">
          Welcome, {user?.name || user?.organizationName || "Donor"}
        </h1>
        <p className="text-muted">
          Overview of your shared resources and their status.
        </p>
      </div>

      <div className="row g-4 mb-5">
        <div className="col-sm-6 col-lg-3">
          <div className="card dashboard-stat-card text-center h-100">
            <div className="card-body">
              <h3>Total Resources</h3>
              <h2>{stats.total}</h2>
              <p>All resources shared</p>
            </div>
          </div>
        </div>
        <div className="col-sm-6 col-lg-3">
          <div className="card dashboard-stat-card text-center h-100">
            <div className="card-body">
              <h3>Pending Approval</h3>
              <h2>{stats.pending}</h2>
              <p>Awaiting admin review</p>
            </div>
          </div>
        </div>
        <div className="col-sm-6 col-lg-3">
          <div className="card dashboard-stat-card text-center h-100">
            <div className="card-body">
              <h3>Available</h3>
              <h2>{stats.available}</h2>
              <p>Visible to organizations</p>
            </div>
          </div>
        </div>
        <div className="col-sm-6 col-lg-3">
          <div className="card dashboard-stat-card text-center h-100">
            <div className="card-body">
              <h3>Accepted</h3>
              <h2>{stats.accepted}</h2>
              <p>Resources claimed</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <h2>Recent Resources</h2>
        <p className="text-muted">
          Your most recently shared resources.
        </p>
      </div>

      {recentDonations.length ? (
        <div className="row g-4">
          {recentDonations.map((donation) => {
            const status = donation.status || "Available";
            return (
              <div className="col-sm-6 col-lg-4" key={donation.resourceId || donation.donationIndex || JSON.stringify(donation)}>
                <div className="card resource-card h-100">
                  <div className="resource-image">
                    {donation.image ? (
                      <img
                        src={donation.image}
                        alt={donation.itemName || "Shared resource"}
                      />
                    ) : (
                      <div className="image-placeholder">Shared resource</div>
                    )}
                  </div>
                  <div className="card-body">
                    <div className="d-flex justify-content-between gap-2 mb-2">
                      <h2 className="h5 mb-0">
                        {donation.itemName || "Untitled Resource"}
                      </h2>
                      <span className="badge text-bg-success">
                        {donation.category || "Food"}
                      </span>
                    </div>
                    <p className="resource-detail">
                      <strong>Quantity:</strong>{" "}
                      {donation.quantity || "Not specified"}
                    </p>
                    <p className="resource-detail">
                      <strong>Pickup:</strong>{" "}
                      {donation.place || "Location not specified"}
                    </p>
                    <p className="resource-detail">
                      <strong>Status:</strong>{" "}
                      <span
                        className={`status-${status.toLowerCase().replace(" ", "-")}`}
                      >
                        {status}
                      </span>
                    </p>
                    <p className="text-muted mb-0">
                      {donation.description || "No description provided."}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="empty-state">
          <h2>No resources shared yet</h2>
          <p>
            Start sharing resources to see them here.
          </p>
        </div>
      )}
    </section>
  );
};

export default DonorDashboard;
