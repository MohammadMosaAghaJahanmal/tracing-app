import React, { useContext } from "react";
import { Outlet, Navigate, useLocation } from "react-router-dom";
import { AdminAuthContext } from "../../contexts/AdminAuthContext";
import AdminSidebar from "./AdminSidebar";

export default function AdminLayout() {
  const { isAuthed } = useContext(AdminAuthContext);
  const loc = useLocation();
  if (!isAuthed) return <Navigate to="/admin/login" replace state={{ from: loc.pathname }} />;

  return (
    <div className="adminRoot">
      <AdminSidebar />
      <div className="adminMain">
        <div className="adminHeader">
          <div className="adminTitle">Admin Dashboard</div>
          <div className="adminHint">Manage content + view analytics</div>
        </div>
        <div className="adminContent">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
