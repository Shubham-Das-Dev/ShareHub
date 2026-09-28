import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext";

const MyDonations = () => {
  const { isLoggedIn, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [donations, setDonations] = useState([]);
  const [allDonations, setAllDonations] = useState([]);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
      return undefined;
    }
    const refreshDonations = () => {
      let allDonationsData = JSON.parse(localStorage.getItem("donations")) || [];
      // Migrate legacy donations to have resourceId
      const needsMigration = allDonationsData.some(d => !d.resourceId);
      if (needsMigration) {
        allDonationsData = allDonationsData.map(donation => ({
          ...donation,
          resourceId: donation.resourceId || `resource-${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${Math.random().toString(36).slice(2, 8)}`
        }));
        localStorage.setItem("donations", JSON.stringify(allDonationsData));
      }
      setAllDonations(allDonationsData);
      const myDonations = allDonationsData.filter(
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
  }, [isLoggedIn, user, navigate]);

  const removeResource = (donation) => {
    if (!window.confirm("Are you sure you want to remove this resource?"))
      return;
    const updatedDonations = allDonations.filter(
      (d) => d !== donation
    );
    localStorage.setItem("donations", JSON.stringify(updatedDonations));
    setAllDonations(updatedDonations);
    const myDonations = updatedDonations.filter(
      (d) => d.donorEmail === user?.email
    );
    setDonations(myDonations);
    window.dispatchEvent(new Event("sharehubDataUpdated"));
  };

  if (!isLoggedIn) return null;
  return (
    <section className="container page-section">
      <div className="mb-4">
        <span className="section-kicker">Your contributions</span>
        <h1 className="mb-1">My Donations</h1>
        <p className="text-muted">
          Resources you have shared with the community.
        </p>
      </div>
      {donations.length ? (
        <div className="row g-4">
          {donations.map((donation) => {
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
                    {(status === "Accepted" || status === "Rejected") && (
                      <button
                        type="button"
                        className="btn btn-outline-danger mt-3"
                        onClick={() => removeResource(donation)}
                      >
                        Remove Resource
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="empty-state">
          <h2>No resources shared yet</h2>
          <p>Your donated resources will appear here.</p>
        </div>
      )}
    </section>
  );
};
export default MyDonations;
