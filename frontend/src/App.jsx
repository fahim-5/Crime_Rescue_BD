import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider, AuthContext } from "./context/AuthContext";
import { useAuth } from "./context/useAuth"; // Use useAuth hook
import Home from "./pages/Home";
import NavbarPublic from "./components/Navbar";
import NavbarPolice from "./components/NavbarPolice";
import NavbarAdmin from "./components/NavbarAdmin";
import Footer from "./components/Footer";
import SignupForm from "./pages/SignupForm";
import LoginForm from "./pages/LoginForm";
import CrimeReportForm from "./pages/CrimeReportForm";
import Notifications from "./pages/Notifications";
import CrimeAlerts from "./pages/CrimeAlerts";
import About from "./pages/About";
import PrivateRoute from "./components/PrivateRoute"; // Assuming you have this component
import AdminDeshboard from "./pages/AdminDeshboard";
import PoliceDeshboard from "./pages/PoliceDeshboard";

function App() {
  return (
    <AuthProvider>
      <Router>
        <RoleBasedNavbar />
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/" element={<SignupForm />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/report" element={<CrimeReportForm />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/alert" element={<CrimeAlerts />} />
          <Route path="/about" element={<About />} />

          {/* Protect the dashboard routes */}
          <Route path="/admin-dashboard" element={<PrivateRoute allowedRole="admin"><AdminDeshboard /></PrivateRoute>} />
          <Route path="/police-dashboard" element={<PrivateRoute allowedRole="police"><PoliceDeshboard /></PrivateRoute>} />
        </Routes>
        <Footer />
      </Router>
    </AuthProvider>
  );
}

// Navbar Selector Component
const RoleBasedNavbar = () => {
  const { user } = useAuth(); // Use the custom hook here to access user

  if (user?.role === "police") {
    return <NavbarPolice />;
  } else if (user?.role === "admin") {
    return <NavbarAdmin />;
  } else {
    return <NavbarPublic />;
  }
};

export default App;
