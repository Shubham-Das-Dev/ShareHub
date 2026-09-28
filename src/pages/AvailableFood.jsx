import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext";

const categories = [
  "All Categories",
  "Food",
  "Clothes",
  "Books",
  "Stationery",
  "Other",
];
const readDonations = () => JSON.parse(localStorage.getItem("donations")) || [];
const readRequests = () => JSON.parse(localStorage.getItem("requests")) || [];

const AvailableFood = () => {
  const [donations, setDonations] = useState(readDonations);
  const [requests, setRequests] = useState(readRequests);
  const [searchText, setSearchText] = useState("");
  const [category, setCategory] = useState("All Categories");
  const navigate = useNavigate();
  const { isLoggedIn, role, user } = useContext(AuthContext);
  const normalizedSearch = searchText.trim().toLowerCase();

  useEffect(() => {
    const refreshData = () => {
      let donationsData = readDonations();
      // Migrate legacy donations to have resourceId
      const needsDonationMigration = donationsData.some(d => !d.resourceId);
      if (needsDonationMigration) {
        donationsData = donationsData.map(donation => ({
          ...donation,
          resourceId: donation.resourceId || `resource-${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${Math.random().toString(36).slice(2, 8)}`
        }));
        localStorage.setItem("donations", JSON.stringify(donationsData));
      }
      setDonations(donationsData);

      let requestsData = readRequests();
      // Migrate legacy requests to have requestId
      const needsRequestMigration = requestsData.some(r => !r.requestId);
      if (needsRequestMigration) {
        requestsData = requestsData.map(request => ({
          ...request,
          requestId: request.requestId || `request-${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${Math.random().toString(36).slice(2, 8)}`
        }));
        localStorage.setItem("requests", JSON.stringify(requestsData));
      }
      setRequests(requestsData);
    };
    refreshData();
    window.addEventListener("sharehubDataUpdated", refreshData);
    window.addEventListener("storage", refreshData);
    return () => {
      window.removeEventListener("sharehubDataUpdated", refreshData);
      window.removeEventListener("storage", refreshData);
    };
  }, []);

  const shown = donations.filter((item) => {
    const itemCategory = item.category || "Food";
    const isAvailable = (item.status || "Available") === "Available";
    const matchesCategory =
      category === "All Categories" || itemCategory === category;
    const searchSource = [
      item.itemName,
      itemCategory,
      item.place,
      item.description,
    ]
      .join(" ")
      .toLowerCase();
    return (
      isAvailable &&
      matchesCategory &&
      (!normalizedSearch || searchSource.includes(normalizedSearch))
    );
  });

  const hasPendingRequest = (donation, donationIndex) =>
    requests.some(
      (request) =>
        request.requesterEmail === user?.email &&
        request.status === "Requested" &&
        (donation.resourceId
          ? request.resourceId === donation.resourceId
          : request.donationIndex === donationIndex),
    );
  const handleRequest = (donation, donationIndex) => {
    if (!isLoggedIn || role !== "organization" || !user) {
      alert("Only organizations can request resources.");
      if (!isLoggedIn) navigate("/login");
      return;
    }
    const storedRequests = readRequests();
    const duplicate = storedRequests.some(
      (request) =>
        request.requesterEmail === user.email &&
        request.status === "Requested" &&
        (donation.resourceId
          ? request.resourceId === donation.resourceId
          : request.donationIndex === donationIndex),
    );
    if (duplicate) {
      alert("This resource has already been requested.");
      return;
    }
    const request = {
      itemName: donation.itemName,
      category: donation.category || "Food",
      quantity: donation.quantity,
      place: donation.place,
      description: donation.description,
      image: donation.image || "",
      resourceId: donation.resourceId || "",
      donationIndex,
      requestId: `request-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      requesterEmail: user.email,
      requesterName: user.organizationName || user.name,
      status: "Requested",
    };
    localStorage.setItem(
      "requests",
      JSON.stringify([...storedRequests, request]),
    );
    window.dispatchEvent(new Event("sharehubDataUpdated"));
    alert("Resource requested successfully!");
    navigate("/my-requests");
  };
  const clearFilters = () => {
    setSearchText("");
    setCategory("All Categories");
  };

  return (
    <section className="container page-section">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end gap-3 mb-4">
        <div>
          <span className="section-kicker">Community listings</span>
          <h1 className="mb-1">Available Resources</h1>
          <p className="text-muted mb-0">
            Showing {shown.length} resource{shown.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>
      <div className="row g-2 mb-4">
        <div className="col-md-6">
          <input
            type="search"
            className="form-control"
            placeholder="Search resources..."
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
          />
        </div>
        <div className="col-md-4">
          <select
            className="form-select"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
          >
            {categories.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </div>
        <div className="col-md-2 d-grid">
          <button
            type="button"
            className="btn btn-outline-success"
            onClick={clearFilters}
          >
            Clear Filters
          </button>
        </div>
      </div>
      {shown.length ? (
        <div className="row g-4">
          {shown.map((donation) => {
            const donationIndex = donations.indexOf(donation);
            const pending = hasPendingRequest(donation, donationIndex);
            return (
              <div
                className="col-sm-6 col-lg-4"
                key={donation.resourceId || donationIndex}
              >
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
                  <div className="card-body d-flex flex-column">
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
                        className={`status-${(donation.status || "Available").toLowerCase().replace(" ", "-")}`}
                      >
                        {donation.status || "Available"}
                      </span>
                    </p>
                    <p className="text-muted mb-3">
                      {donation.description || "No description provided."}
                    </p>
                    {role === "organization" &&
                      (pending ? (
                        <button
                          className="btn btn-outline-success mt-auto"
                          disabled
                        >
                          Request Pending
                        </button>
                      ) : (
                        <button
                          className="btn btn-success mt-auto"
                          onClick={() => handleRequest(donation, donationIndex)}
                        >
                          Request Resource
                        </button>
                      ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="empty-state">
          <h2>No resources found</h2>
          <p>Try another search or category.</p>
        </div>
      )}
    </section>
  );
};
export default AvailableFood;
