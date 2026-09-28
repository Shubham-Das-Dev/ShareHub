import { useEffect, useState } from "react";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [donations, setDonations] = useState([]);
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const refreshData = () => {
      setUsers(JSON.parse(localStorage.getItem("users")) || []);
      setDonations(JSON.parse(localStorage.getItem("donations")) || []);
      setRequests(JSON.parse(localStorage.getItem("requests")) || []);
    };
    refreshData();
    window.addEventListener("sharehubDataUpdated", refreshData);
    window.addEventListener("storage", refreshData);
    return () => {
      window.removeEventListener("sharehubDataUpdated", refreshData);
      window.removeEventListener("storage", refreshData);
    };
  }, []);

  const stats = {
    totalUsers: users.length,
    pendingResources: donations.filter(
      (d) => (d.status || "Available") === "Pending Approval"
    ).length,
    availableResources: donations.filter(
      (d) => (d.status || "Available") === "Available"
    ).length,
    pendingRequests: requests.filter(
      (r) => (r.status || "Requested") === "Requested"
    ).length,
    acceptedRequests: requests.filter(
      (r) => (r.status || "Requested") === "Accepted"
    ).length,
    rejectedRequests: requests.filter(
      (r) => (r.status || "Requested") === "Rejected"
    ).length,
  };

  const recentActivity = [...donations, ...requests]
    .sort((a, b) => {
      const aId = a.resourceId || "";
      const bId = b.resourceId || "";
      const aTimestamp = parseInt(aId.split("-")[1] || "0");
      const bTimestamp = parseInt(bId.split("-")[1] || "0");
      return bTimestamp - aTimestamp;
    })
    .slice(0, 5);

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">Admin Dashboard</h1>

      <div className="row g-4 mb-5">
        <div className="col-sm-6 col-lg-4">
          <div className="card dashboard-stat-card text-center h-100">
            <div className="card-body">
              <h3>Total Users</h3>
              <h2>{stats.totalUsers}</h2>
              <p>Registered users</p>
            </div>
          </div>
        </div>

        <div className="col-sm-6 col-lg-4">
          <div className="card dashboard-stat-card text-center h-100">
            <div className="card-body">
              <h3>Pending Resources</h3>
              <h2>{stats.pendingResources}</h2>
              <p>Awaiting approval</p>
            </div>
          </div>
        </div>

        <div className="col-sm-6 col-lg-4">
          <div className="card dashboard-stat-card text-center h-100">
            <div className="card-body">
              <h3>Available Resources</h3>
              <h2>{stats.availableResources}</h2>
              <p>Visible to organizations</p>
            </div>
          </div>
        </div>

        <div className="col-sm-6 col-lg-4">
          <div className="card dashboard-stat-card text-center h-100">
            <div className="card-body">
              <h3>Pending Requests</h3>
              <h2>{stats.pendingRequests}</h2>
              <p>Awaiting review</p>
            </div>
          </div>
        </div>

        <div className="col-sm-6 col-lg-4">
          <div className="card dashboard-stat-card text-center h-100">
            <div className="card-body">
              <h3>Accepted Requests</h3>
              <h2>{stats.acceptedRequests}</h2>
              <p>Requests approved</p>
            </div>
          </div>
        </div>

        <div className="col-sm-6 col-lg-4">
          <div className="card dashboard-stat-card text-center h-100">
            <div className="card-body">
              <h3>Rejected Requests</h3>
              <h2>{stats.rejectedRequests}</h2>
              <p>Requests declined</p>
            </div>
          </div>
        </div>
      </div>

      {recentActivity.length > 0 && (
        <div>
          <h2 className="mb-3">Recent Activity</h2>
          <div className="row g-4">
            {recentActivity.map((item) => {
              const isDonation = item.itemName && !item.requesterEmail;
              const status = item.status || (isDonation ? "Available" : "Requested");
              return (
                <div className="col-md-6" key={item.resourceId || item.requestId || JSON.stringify(item)}>
                  <div className="card">
                    <div className="card-body">
                      <h5 className="card-title">
                        {isDonation ? "Resource" : "Request"}: {item.itemName}
                      </h5>
                      <p className="card-text">
                        <strong>Type:</strong>{" "}
                        {isDonation ? item.category || "Food" : "Resource Request"}
                      </p>
                      <p className="card-text">
                        <strong>Status:</strong>{" "}
                        <span
                          className={`status-${status.toLowerCase().replace(" ", "-")}`}
                        >
                          {status}
                        </span>
                      </p>
                      {!isDonation && item.requesterName && (
                        <p className="card-text">
                          <strong>Organization:</strong> {item.requesterName}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
