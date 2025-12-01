import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { LandingPage } from "./components/LandingPagee/LandingPage";
import { AuthPage } from "./components/Auth/AuthPage";
import { Dashboard } from "./components/dashboard/Dashboard";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}
