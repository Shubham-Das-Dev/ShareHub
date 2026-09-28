import { useEffect, useState } from "react";

const AdminFood = () => {
  const [donations, setDonations] = useState(
    JSON.parse(localStorage.getItem("donations")) || [],
  );

  useEffect(() => {
    const refreshDonations = () =>
      setDonations(JSON.parse(localStorage.getItem("donations")) || []);
    window.addEventListener("sharehubDataUpdated", refreshDonations);
    window.addEventListener("storage", refreshDonations);
    return () => {
      window.removeEventListener("sharehubDataUpdated", refreshDonations);
      window.removeEventListener("storage", refreshDonations);
    };
  }, []);

  const removeFood = (index) => {
    if (window.confirm("Are you sure you want to remove this resource?")) {
      const updatedDonations = donations.filter(
        (_, donationIndex) => donationIndex !== index,
      );
      localStorage.setItem("donations", JSON.stringify(updatedDonations));
      setDonations(updatedDonations);
      window.dispatchEvent(new Event("sharehubDataUpdated"));
    }
  };

  const updateApprovalStatus = (index, status) => {
    const updatedDonations = donations.map((donation, donationIndex) =>
      donationIndex === index ? { ...donation, status } : donation,
    );
    localStorage.setItem("donations", JSON.stringify(updatedDonations));
    setDonations(updatedDonations);
    window.dispatchEvent(new Event("sharehubDataUpdated"));
  };

  const manageableDonations = donations.filter(
    (donation) => {
      const status = donation.status || "Available";
      return status === "Pending Approval" || status === "Available";
    }
  );

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">Manage Resources</h1>
      <div className="row">
        {manageableDonations.map((donation) => {
          const originalIndex = donations.indexOf(donation);
          const status = donation.status || "Available";
          return (
            <div className="col-md-4 mb-4" key={donation.resourceId || originalIndex}>
              <div className="card">
                {donation.image ? (
                  <img
                    src={donation.image}
                    className="card-img-top"
                    alt={donation.itemName}
                  />
                ) : (
                  <div
                    className="image-placeholder"
                    style={{ height: "200px" }}
                  >
                    Shared resource
                  </div>
                )}
                <div className="card-body">
                  <h5 className="card-title">{donation.itemName}</h5>
                  <span className="badge text-bg-success mb-2 me-2">
                    {donation.category || "Food"}
                  </span>
                  <span
                    className={
                      status === "Available"
                        ? "badge text-bg-success"
                        : "badge text-bg-secondary"
                    }
                  >
                    {status}
                  </span>
                  <p className="card-text mt-2">
                    Quantity: {donation.quantity}
                  </p>
                  <p className="card-text">
                    Pickup Location: {donation.place}
                  </p>
                  <p className="card-text">{donation.description}</p>
                  {status === "Pending Approval" && (
                    <div className="d-flex gap-2 mb-2">
                      <button
                        className="btn btn-success"
                        onClick={() => updateApprovalStatus(originalIndex, "Available")}
                      >
                        Approve
                      </button>
                      <button
                        className="btn btn-outline-danger"
                        onClick={() => updateApprovalStatus(originalIndex, "Rejected")}
                      >
                        Reject
                      </button>
                    </div>
                  )}
                  <button
                    className="btn btn-danger"
                    onClick={() => removeFood(originalIndex)}
                  >
                    Remove Resource
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
export default AdminFood;
