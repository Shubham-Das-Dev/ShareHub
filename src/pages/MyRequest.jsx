import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext";

const MyRequests = () => {
  const { isLoggedIn, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [requests, setRequests] = useState(
    JSON.parse(localStorage.getItem("requests")) || [],
  );
  const [donations, setDonations] = useState(
    JSON.parse(localStorage.getItem("donations")) || [],
  );

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
      return undefined;
    }
    const refreshData = () => {
      let requestsData = JSON.parse(localStorage.getItem("requests")) || [];
      // Migrate legacy requests to have requestId
      const needsMigration = requestsData.some(r => !r.requestId);
      if (needsMigration) {
        requestsData = requestsData.map(request => ({
          ...request,
          requestId: request.requestId || `request-${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${Math.random().toString(36).slice(2, 8)}`
        }));
        localStorage.setItem("requests", JSON.stringify(requestsData));
      }
      setRequests(requestsData);
      setDonations(JSON.parse(localStorage.getItem("donations")) || []);
    };
    window.addEventListener("sharehubDataUpdated", refreshData);
    window.addEventListener("storage", refreshData);
    return () => {
      window.removeEventListener("sharehubDataUpdated", refreshData);
      window.removeEventListener("storage", refreshData);
    };
  }, [isLoggedIn, navigate]);

  const myRequests = requests.filter(
    (request) => request.requesterEmail === user?.email,
  );
  if (!isLoggedIn) return null;
  return (
    <section className="container page-section">
      <div className="mb-4">
        <span className="section-kicker">Organization activity</span>
        <h1 className="mb-1">My Resource Requests</h1>
        <p className="text-muted">
          Track the status of resources requested by your organization.
        </p>
      </div>
      {myRequests.length ? (
        <div className="row g-4">
          {myRequests.map((request) => {
            const resource = donations.find((donation) =>
              request.resourceId
                ? donation.resourceId === request.resourceId
                : donations.indexOf(donation) === request.donationIndex,
            );
            return (
              <div
                className="col-sm-6 col-lg-4"
                key={request.requestId || request.resourceId || request.donationIndex || JSON.stringify(request)}
              >
                <div className="card resource-card h-100">
                  <div className="resource-image">
                    {request.image || resource?.image ? (
                      <img
                        src={request.image || resource?.image}
                        alt={request.itemName || "Requested resource"}
                      />
                    ) : (
                      <div className="image-placeholder">
                        Requested resource
                      </div>
                    )}
                  </div>
                  <div className="card-body">
                    <div className="d-flex justify-content-between gap-2 mb-2">
                      <h2 className="h5 mb-0">
                        {request.itemName || "Untitled Resource"}
                      </h2>
                      <span className="badge text-bg-success">
                        {request.category || "Food"}
                      </span>
                    </div>
                    <p className="resource-detail">
                      <strong>Quantity:</strong>{" "}
                      {request.quantity || "Not specified"}
                    </p>
                    <p className="resource-detail">
                      <strong>Pickup:</strong>{" "}
                      {request.place || "Location not specified"}
                    </p>
                    <p className="text-muted">
                      {request.description || "No description provided."}
                    </p>
                    <p className="mb-0">
                      <strong>Status:</strong>{" "}
                      <span
                        className={`status-${(request.status || "Requested").toLowerCase()}`}
                      >
                        {request.status || "Requested"}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="empty-state">
          <h2>No resource requests yet</h2>
          <p>
            Browse available resources to request what your organization needs.
          </p>
        </div>
      )}
    </section>
  );
};
export default MyRequests;
