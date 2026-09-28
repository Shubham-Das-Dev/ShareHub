import { useEffect, useState } from "react";

const AdminRequests = () => {
  const [requests, setRequests] = useState(
    JSON.parse(localStorage.getItem("requests")) || [],
  );
  const [donations, setDonations] = useState(
    JSON.parse(localStorage.getItem("donations")) || [],
  );

  useEffect(() => {
    const refreshData = () => {
      setRequests(JSON.parse(localStorage.getItem("requests")) || []);
      setDonations(JSON.parse(localStorage.getItem("donations")) || []);
    };
    window.addEventListener("sharehubDataUpdated", refreshData);
    window.addEventListener("storage", refreshData);
    return () => {
      window.removeEventListener("sharehubDataUpdated", refreshData);
      window.removeEventListener("storage", refreshData);
    };
  }, []);

  const pendingRequests = requests
    .filter((request) => (request.status || "Requested") === "Requested");
  const findResourceIndex = (request, resources) =>
    resources.findIndex((resource, index) =>
      request.resourceId
        ? resource.resourceId === request.resourceId
        : index === request.donationIndex,
    );

  const updateStatus = (request, newStatus) => {
    const updatedRequests = requests.map((r) =>
      r === request ? { ...r, status: newStatus } : r,
    );
    localStorage.setItem("requests", JSON.stringify(updatedRequests));
    setRequests(updatedRequests);
    if (newStatus === "Accepted") {
      const resourceIndex = findResourceIndex(request, donations);
      if (resourceIndex !== -1) {
        const updatedDonations = donations.map((resource, index) =>
          index === resourceIndex
            ? { ...resource, status: "Accepted" }
            : resource,
        );
        localStorage.setItem("donations", JSON.stringify(updatedDonations));
        setDonations(updatedDonations);
        window.dispatchEvent(new Event("sharehubDataUpdated"));
      }
    }
    window.dispatchEvent(new Event("sharehubDataUpdated"));
  };

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">Manage Resource Requests</h1>
      <div className="row">
        {pendingRequests.map((request) => {
          const resource = donations[findResourceIndex(request, donations)];
          return (
            <div
              className="col-md-6 mb-4"
              key={request.requestId || request.resourceId || request.donationIndex || JSON.stringify(request)}
            >
              <div className="card">
                {resource?.image || request.image ? (
                  <img
                    src={resource?.image || request.image}
                    className="card-img-top"
                    alt={request.itemName}
                    style={{ height: "220px", objectFit: "cover" }}
                  />
                ) : (
                  <div
                    className="image-placeholder"
                    style={{ height: "220px" }}
                  >
                    Requested resource
                  </div>
                )}
                <div className="card-body">
                  <h3>{request.itemName}</h3>
                  <span className="badge text-bg-success me-2">
                    {request.category || "Food"}
                  </span>
                  <span className="status-requested">Requested</span>
                  <p className="mt-3 mb-1">
                    <strong>Quantity:</strong> {request.quantity}
                  </p>
                  <p className="mb-1">
                    <strong>Requesting organization:</strong>{" "}
                    {request.requesterName || "Legacy request"}
                  </p>
                  <p className="mb-1">
                    <strong>Organization email:</strong>{" "}
                    {request.requesterEmail || "Not recorded"}
                  </p>
                  <p className="mb-1">
                    <strong>Pickup Location:</strong> {request.place}
                  </p>
                  <p>{request.description}</p>
                  <button
                    className="btn btn-success me-2"
                    onClick={() => updateStatus(request, "Accepted")}
                  >
                    Accept
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => updateStatus(request, "Rejected")}
                  >
                    Reject
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default AdminRequests;
