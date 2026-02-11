import React, { Suspense, lazy, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AdminAuthProvider from "./contexts/AdminAuthContext";
import { startSession } from "./utils/tracking";

import SiteLayout from "./components/Layout/SiteLayout";
import AdminLayout from "./components/Layout/AdminLayout";

const Home = lazy(() => import("./pages/Home"));
const NotFound = lazy(() => import("./pages/NotFound"));

const AdminLogin = lazy(() => import("./pages/Admin/Login"));
const AdminDashboard = lazy(() => import("./pages/Admin/Dashboard"));
const AdminQuestions = lazy(() => import("./pages/Admin/Questions"));
const AdminSliderImages = lazy(() => import("./pages/Admin/SliderImages"));
const AdminSocialLinks = lazy(() => import("./pages/Admin/SocialLinks"));
const AdminStories = lazy(() => import("./pages/Admin/Stories"));
const AdminTrackingData = lazy(() => import("./pages/Admin/TrackingData"));
const AdminResponses = lazy(() => import("./pages/Admin/Responses"));
const AdminLiveText = lazy(() => import("./pages/Admin/LiveText"));
const Clicks = lazy(() => import("./pages/Admin/Clicks"));

export default function App() {
  useEffect(() => {
    startSession().catch(() => {});
  }, []);

  return (
    <AdminAuthProvider>
      <BrowserRouter>
        <Suspense fallback={<div className="pageCenter">Loading...</div>}>
          <Routes>
            <Route element={<SiteLayout />}>
              <Route path="/" element={<Home />} />
            </Route>

            <Route path="/admin/login" element={<AdminLogin />} />

            <Route element={<AdminLayout />}>
              <Route path="/admin" element={<Navigate to="/admin/dashboard" />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/questions" element={<AdminQuestions />} />
              <Route path="/admin/slider-images" element={<AdminSliderImages />} />
              <Route path="/admin/social-links" element={<AdminSocialLinks />} />
              <Route path="/admin/stories" element={<AdminStories />} />
              <Route path="/admin/tracking" element={<AdminTrackingData />} />
              <Route path="/admin/responses" element={<AdminResponses />} />
              <Route path="/admin/live-text" element={<AdminLiveText />} />
              <Route path="/admin/clicks" element={<Clicks />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AdminAuthProvider>
  );
}
