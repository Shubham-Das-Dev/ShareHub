import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />

      <main className="flex-grow-1" style={{ paddingTop: '85px' }}>
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default Layout;
