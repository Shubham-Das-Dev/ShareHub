import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext";

const OrganizationDashboard = () => {
  const { isLoggedIn, role, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
      return undefined;
    }
    if (role !== "organization") {
      navigate("/");
      return undefined;
    }
    const refreshRequests = () => {
      const allRequests = JSON.parse(localStorage.getItem("requests")) || [];
      const myRequests = allRequests.filter(
        (request) => request.requesterEmail === user?.email
      );
      setRequests(myRequests);
    };
    refreshRequests();
    window.addEventListener("sharehubDataUpdated", refreshRequests);
    window.addEventListener("storage", refreshRequests);
    return () => {
      window.removeEventListener("sharehubDataUpdated", refreshRequests);
      window.removeEventListener("storage", refreshRequests);
    };
  }, [isLoggedIn, role, user, navigate]);

  const stats = {
    total: requests.length,
    pending: requests.filter(
      (r) => (r.status || "Requested") === "Requested"
    ).length,
    accepted: requests.filter((r) => (r.status || "Requested") === "Accepted")
      .length,
    rejected: requests.filter((r) => (r.status || "Requested") === "Rejected")
      .length,
  };

  const recentRequests = requests.slice(0, 5);

  if (!isLoggedIn || role !== "organization") return null;

  return (
    <section className="container page-section">
      <div className="mb-4">
        <span className="section-kicker">Organization dashboard</span>
        <h1 className="mb-1">
          Welcome, {user?.organizationName || user?.name || "Organization"}
        </h1>
        <p className="text-muted">
          Overview of your resource requests and their status.
        </p>
      </div>

      <div className="row g-4 mb-5">
        <div className="col-sm-6 col-lg-3">
          <div className="card dashboard-stat-card text-center h-100">
            <div className="card-body">
              <h3>Total Requests</h3>
              <h2>{stats.total}</h2>
              <p>All requests made</p>
            </div>
          </div>
        </div>
        <div className="col-sm-6 col-lg-3">
          <div className="card dashboard-stat-card text-center h-100">
            <div className="card-body">
              <h3>Pending Requests</h3>
              <h2>{stats.pending}</h2>
              <p>Awaiting admin review</p>
            </div>
          </div>
        </div>
        <div className="col-sm-6 col-lg-3">
          <div className="card dashboard-stat-card text-center h-100">
            <div className="card-body">
              <h3>Accepted Requests</h3>
              <h2>{stats.accepted}</h2>
              <p>Requests approved</p>
            </div>
          </div>
        </div>
        <div className="col-sm-6 col-lg-3">
          <div className="card dashboard-stat-card text-center h-100">
            <div className="card-body">
              <h3>Rejected Requests</h3>
              <h2>{stats.rejected}</h2>
              <p>Requests declined</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <h2>Recent Requests</h2>
        <p className="text-muted">
          Your most recent resource requests.
        </p>
      </div>

      {recentRequests.length ? (
        <div className="row g-4">
          {recentRequests.map((request) => {
            const status = request.status || "Requested";
            return (
              <div
                className="col-sm-6 col-lg-4"
                key={request.requestId || request.resourceId || request.donationIndex || JSON.stringify(request)}
              >
                <div className="card resource-card h-100">
                  <div className="resource-image">
                    {request.image ? (
                      <img
                        src={request.image}
                        alt={request.itemName || "Requested resource"}
                      />
                    ) : (
                      <div className="image-placeholder">Requested resource</div>
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
                    <p className="resource-detail">
                      <strong>Status:</strong>{" "}
                      <span
                        className={`status-${status.toLowerCase()}`}
                      >
                        {status}
                      </span>
                    </p>
                    <p className="text-muted mb-0">
                      {request.description || "No description provided."}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="empty-state">
          <h2>No requests yet</h2>
          <p>
            Browse available resources to make your first request.
          </p>
        </div>
      )}
    </section>
  );
};

export default OrganizationDashboard;
