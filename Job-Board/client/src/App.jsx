import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Jobs from "./pages/Jobs";
import JobDetails from "./pages/JobDetails";
import ApplyJob from "./pages/ApplyJob";
import ApplicationSuccess from "./pages/ApplicationSuccess";

import SavedJobs from "./pages/SavedJobs";
import AppliedJobs from "./pages/AppliedJobs";
import Profile from "./pages/Profile";

import EmployerDashboard from "./pages/EmployerDashboard";
import PostJob from "./pages/PostJob";
import ManageJobs from "./pages/ManageJobs";
import EditJob from "./pages/EditJob";

import Login from "./pages/Login";
import Register from "./pages/Register";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>
      {/* Home */}
      <Route
        path="/"
        element={<Home />}
      />

      {/* Jobs */}
      <Route
        path="/jobs"
        element={<Jobs />}
      />

      {/* Job Details */}
      <Route
        path="/jobs/:id"
        element={<JobDetails />}
      />

      {/* Candidate Module */}
      <Route
        path="/apply/:id"
        element={<ApplyJob />}
      />

      <Route
        path="/application-success"
        element={<ApplicationSuccess />}
      />

      <Route
        path="/saved-jobs"
        element={<SavedJobs />}
      />

      <Route
        path="/applied-jobs"
        element={<AppliedJobs />}
      />

      <Route
        path="/profile"
        element={<Profile />}
      />

      {/* Employer Module (Protected) */}

      <Route
        path="/employer-dashboard"
        element={
          <ProtectedRoute>
            <EmployerDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/post-job"
        element={
          <ProtectedRoute>
            <PostJob />
          </ProtectedRoute>
        }
      />

      <Route
        path="/manage-jobs"
        element={
          <ProtectedRoute>
            <ManageJobs />
          </ProtectedRoute>
        }
      />

      <Route
        path="/edit-job/:id"
        element={
          <ProtectedRoute>
            <EditJob />
          </ProtectedRoute>
        }
      />

      {/* Authentication */}

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/register"
        element={<Register />}
      />
    </Routes>
  );
}

export default App;