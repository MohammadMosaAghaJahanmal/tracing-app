import React, { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AdminAuthContext } from "../../contexts/AdminAuthContext";

export default function AdminSidebar() {
  const { logout } = useContext(AdminAuthContext);
  const nav = useNavigate();

  const doLogout = () => {
    logout();
    nav("/admin/login");
  };

  return (
    <aside className="adminSidebar">
      <div className="adminBrand">Tracking Admin</div>

      <nav className="adminNav">
        <NavLink to="/admin/dashboard">Dashboard</NavLink>
        <NavLink to="/admin/questions">Questions</NavLink>
        <NavLink to="/admin/slider-images">Slider Images</NavLink>
        <NavLink to="/admin/social-links">Social Links</NavLink>
        <NavLink to="/admin/stories">Stories</NavLink>
        <div className="navSep" />
        <NavLink to="/admin/tracking">User Tracking</NavLink>
        <NavLink to="/admin/responses">Responses</NavLink>
        <NavLink to="/admin/live-text">Live Text</NavLink>
        <NavLink to="/admin/clicks">Button Clicks</NavLink>
        <NavLink to="/admin/share-requests" className="navItem">Share Requests</NavLink>
        <NavLink to="/admin/user-shares" className="navItem">User Shares</NavLink>
      </nav>

      <button className="btn danger" onClick={doLogout}>Logout</button>
    </aside>
  );
}
