import React from "react";
import { Outlet } from "react-router-dom";
import GlobalClickTracker from "../Tracking/GlobalClickTracker";

export default function SiteLayout() {
  return (
    <div className="siteRoot">
      <GlobalClickTracker />
      <header className="topBar">
        <div className="brand">Written in Qadr</div>
        <div className="sub">Between Hope & Dua</div>
      </header>
      <main className="container">
        <Outlet />
      </main>
      <footer className="footer">
        © {new Date().getFullYear()} Written in Qadr
      </footer>
    </div>
  );
}
