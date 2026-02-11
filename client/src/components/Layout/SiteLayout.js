import React from "react";
import { Outlet } from "react-router-dom";
import GlobalClickTracker from "../Tracking/GlobalClickTracker";

export default function SiteLayout() {
  return (
    <div className="siteRoot">
      <GlobalClickTracker />
      <header className="topBar">
        <div className="brand">Tracking App</div>
        <div className="sub">Real-time interaction tracking + dynamic content</div>
      </header>
      <main className="container">
        <Outlet />
      </main>
      <footer className="footer">© {new Date().getFullYear()} Tracking App</footer>
    </div>
  );
}
