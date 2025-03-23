import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import SignupForm from "./pages/SignupForm";
import LoginForm from "./pages/LoginForm";
import CrimeReportForm from "./pages/CrimeReportForm";
import Notifications from "./pages/Notifications";
import CrimeAlerts from "./pages/CrimeAlerts";
import About from "./pages/About";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/" element={<SignupForm />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/report" element={<CrimeReportForm />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/alert" element={<CrimeAlerts />} />
          <Route path="/about" element={<About />} />
        </Routes>
        <Footer />
      </Router>
    </AuthProvider>
  );
}

export default App;
