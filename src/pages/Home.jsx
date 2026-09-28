import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="container page-section home-hero">
        <div className="row align-items-center g-4 g-lg-5">
          <div className="col-lg-6 hero-copy">
            <span className="badge rounded-pill px-3 py-2 mb-3">
              Share more. Waste less.
            </span>
            <h1 className="mb-3">ShareHub</h1>
            <p className="lead fw-semibold mb-3">
              Turning surplus into shared opportunity.
            </p>
            <p className="text-secondary mb-4">
              A simple campus community platform that connects donors with
              organizations ready to put useful resources to good use. Share
              food, clothes, books, stationery, and more.
            </p>
            <div className="d-flex flex-wrap gap-2">
              <Link
                to="/available-food"
                className="btn btn-success btn-lg px-4"
              >
                View Available Resources
              </Link>
              <Link
                to="/donate-food"
                className="btn btn-outline-success btn-lg px-4"
              >
                Donate Resources
              </Link>
            </div>
            <div className="d-flex flex-wrap gap-4 mt-4 text-secondary small">
              <span>
                <strong className="text-success fs-5">01</strong> easy-to-use
                platform
              </span>
              <span>
                <strong className="text-success fs-5">02</strong>{" "}
                community-first impact
              </span>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="position-relative overflow-hidden rounded-4 hero-visual">
              <img
                src="https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1200&q=85"
                alt="Community members sharing useful resources"
                className="img-fluid w-100"
                style={{ height: "360px", objectFit: "cover" }}
              />
              <div
                className="position-absolute bottom-0 start-0 end-0 p-3 text-white"
                style={{
                  background:
                    "linear-gradient(transparent, rgba(0, 74, 42, 0.9))",
                }}
              >
                <p className="mb-0 fw-semibold">
                  Every resource shared is a step toward a stronger community.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="container page-section home-section">
        <div className="home-section-heading text-center">
          <span className="section-kicker">Simple by design</span>
          <h2 className="fw-bold mt-2 mb-2">How ShareHub Works</h2>
          <p className="text-secondary mb-0">
            Three thoughtful steps turn surplus resources into meaningful
            support.
          </p>
        </div>
        <div className="row g-4">
          <div className="col-md-4">
            <div className="card home-step-card h-100 text-center">
              <div className="card-body">
                <div
                  className="bg-success text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3 step-number"
                  style={{ width: "52px", height: "52px" }}
                >
                  <span className="fs-5 fw-bold">1</span>
                </div>
                <h3 className="h5 fw-bold">Donate surplus</h3>
                <p className="card-text text-secondary mb-0">
                  List surplus resources with their category, quantity,
                  location, description, and image.
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card home-step-card h-100 text-center">
              <div className="card-body">
                <div
                  className="bg-success text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3 step-number"
                  style={{ width: "52px", height: "52px" }}
                >
                  <span className="fs-5 fw-bold">2</span>
                </div>
                <h3 className="h5 fw-bold">Discover resources</h3>
                <p className="card-text text-secondary mb-0">
                  Organizations can browse useful resources shared by generous
                  donors.
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card home-step-card h-100 text-center">
              <div className="card-body">
                <div
                  className="bg-success text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3 step-number"
                  style={{ width: "52px", height: "52px" }}
                >
                  <span className="fs-5 fw-bold">3</span>
                </div>
                <h3 className="h5 fw-bold">Request and connect</h3>
                <p className="card-text text-secondary mb-0">
                  Request what is needed and keep track of each shared
                  contribution.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why ShareHub */}
      <section className="container page-section">
        <div className="card home-impact">
          <div className="card-body p-4 p-md-5">
            <div className="row align-items-center g-4">
              <div className="col-lg-7 text-start">
                <span className="text-uppercase small fw-bold opacity-75">
                  The ShareHub difference
                </span>
                <h2 className="fw-bold mt-2 mb-3">
                  Useful resources belong in our communities, not in the bin.
                </h2>
                <p className="mb-0 opacity-75">
                  ShareHub makes resource sharing visible, organized, and
                  accessible. By bringing students, donors, and community
                  organizations together, every contribution can create a real
                  local impact.
                </p>
              </div>
              <div className="col-lg-5">
                <div className="row g-3 text-center">
                  <div className="col-6">
                    <div className="bg-white text-success rounded-3 p-3 h-100">
                      <div className="fs-2 fw-bold">01</div>
                      <div className="small fw-semibold">Less waste</div>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="bg-white text-success rounded-3 p-3 h-100">
                      <div className="fs-2 fw-bold">02</div>
                      <div className="small fw-semibold">More shared support</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
