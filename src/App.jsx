import React from "react";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import MembersManage from "./pages/MembersManage.jsx";
import Landing from "./pages/Landing.jsx";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Profile from "./pages/Profile.jsx";
import Team from "./pages/Team.jsx";
import EventsManage from "./pages/EventsManage.jsx";
import PastEvents from "./pages/PastEvents.jsx";
import Sponsors from "./pages/Sponsors.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Layout from "./components/Layout.jsx";
const App = () => {
  return (
    <AuthProvider>
      <Routes>
        {/* Public landing */}
        <Route path="/" element={<Landing />} />

        {/* Past Events — public */}
        <Route path="/past-events" element={<PastEvents />} />

        {/* Sponsors */}
        <Route path="/sponsors" element={<Sponsors />} />

        {/* Member login */}
        <Route path="/login" element={<Login />} />

        {/* Dashboard home */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Team */}
        <Route
          path="/dashboard/team"
          element={
            <ProtectedRoute>
              <Layout>
                <Team />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/profile"
          element={
            <ProtectedRoute>
              <Layout>
                <Profile />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Members */}
        <Route
          path="/dashboard/members"
          element={
            <ProtectedRoute>
              <Layout>
                <MembersManage />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Events */}
        <Route
          path="/dashboard/events"
          element={
            <ProtectedRoute>
              <Layout>
                <EventsManage />
              </Layout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </AuthProvider>
  );
};

export default App;
