import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider, AuthContext } from "./context/AuthContext";
import { useAuth } from "./context/useAuth";
import Home from "./pages/Home";
import NavbarPublic from "./components/Navbar";
import NavbarPolice from "./components/NavbarPolice";
import NavbarAdmin from "./components/NavbarAdmin";
import Footer from "./components/Footer";
import SignupForm from "./pages/PublicSignup";
import LoginForm from "./pages/LoginForm";
import CrimeReportForm from "./pages/CrimeReportForm";
import Notifications from "./pages/Notifications";
import CrimeAlerts from "./pages/CrimeAlerts";
import About from "./pages/About";
import PrivateRoute from "./components/PrivateRoute";
// import AdminDashboard from "./pages/AdminDashboard";
// import PoliceDashboard from "./pages/PoliceDashboard";
// import UserManagement from "./pages/admin/UserManagement";
// import CrimeReports from "./pages/admin/CrimeReports";
import Validations from "./pages/admin/Validations";
import Start from "./pages/Start";
import PoliceSignup from "./pages/PoliceSignup";
import AdminSignup from "./pages/AdminSignup";
import PublicSignup from "./pages/PublicSignup";
// import PoliceAlerts from "./pages/admin/PoliceAlerts";
// import Analytics from "./pages/admin/Analytics";
// import AdminSettings from "./pages/admin/AdminSettings";


function App() {
  return (
    <AuthProvider>
      <Router>
        <RoleBasedNavbar />
        <Routes>

        <Route path="/start" element={<Start />} />
        <Route path="/police-signup" element={<PoliceSignup />} />
        <Route path="/admin-signup" element={<AdminSignup />} />
        <Route path="/public-signup" element={<PublicSignup />} />
        


          <Route path="/home" element={<Home />} />
          <Route path="/" element={<LoginForm />} />
          <Route path="/report" element={<CrimeReportForm />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/alert" element={<CrimeAlerts />} />
          <Route path="/about" element={<About />} />
          
          
          
          <Route path="/admin/validations" element={<PrivateRoute allowedRole="admin"><Validations /></PrivateRoute>} />
          
          {/* <Route path="/admin/dashboard" element={<PrivateRoute allowedRole="admin"><AdminDashboard /></PrivateRoute>} />
          <Route path="/admin/users" element={<PrivateRoute allowedRole="admin"><UserManagement /></PrivateRoute>} />
          <Route path="/admin/reports" element={<PrivateRoute allowedRole="admin"><CrimeReports /></PrivateRoute>} />
          <Route path="/admin/police-alerts" element={<PrivateRoute allowedRole="admin"><PoliceAlerts /></PrivateRoute>} />
          <Route path="/admin/analytics" element={<PrivateRoute allowedRole="admin"><Analytics /></PrivateRoute>} />
          <Route path="/admin/settings" element={<PrivateRoute allowedRole="admin"><AdminSettings /></PrivateRoute>} />  */}




          {/* Protected Police Routes */}
          {/* <Route path="/police-dashboard" element={<PrivateRoute allowedRole="police"><PoliceDashboard /></PrivateRoute>} /> */}


        </Routes>
        <Footer />
      </Router>
    </AuthProvider>
  );
}

const RoleBasedNavbar = () => {
  const { user } = useAuth();
  return user?.role === "police" ? <NavbarPolice /> : user?.role === "admin" ? <NavbarAdmin /> : <NavbarPublic />;
};

export default App;

