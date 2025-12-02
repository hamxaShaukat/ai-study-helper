import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import { LandingPage } from "./components/LandingPagee/LandingPage";
import { AuthPage } from "./components/Auth/AuthPage";
import { Dashboard } from "./components/dashboard/Dashboard";
import LoadingSpinner from "./components/LoadingSpinner";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();

  // While loading auth state, show spinner to prevent unauthorized access
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-purple-900 to-black">
        <LoadingSpinner />
      </div>
    );
  }

  // If not authenticated, redirect to auth page immediately
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // User is authenticated, show protected content
  return <>{children}</>;
};

export default function App() {
  const { loading } = useAuth();

  // Wait for auth state to be initialized before rendering routes
  // This prevents brief unauthorized access to protected routes
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-purple-900 to-black">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        {/* Catch-all: redirect unknown routes to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
