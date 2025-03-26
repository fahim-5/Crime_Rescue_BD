import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Navbar.css";
import "./profile_popup.css";

const NavbarAdmin = () => {
  const [profileOpen, setProfileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const popupRef = useRef(null);
  const userName = "Guest"; // Fallback name when no user is logged in

  const toggleProfilePopup = () => setProfileOpen((prev) => !prev);

  const showAlert = (message, type = "info") => {
    const alertBox = document.createElement("div");
    alertBox.classList.add("custom-alert", `alert-${type}`, "show");
    alertBox.innerHTML = `${message} <span class="alert-close">&times;</span>`;
    document.body.appendChild(alertBox);

    alertBox.querySelector(".alert-close").addEventListener("click", () => {
      alertBox.style.opacity = "0";
      setTimeout(() => alertBox.remove(), 400);
    });

    setTimeout(() => {
      alertBox.style.opacity = "0";
      setTimeout(() => alertBox.remove(), 400);
    }, 3000);
  };

  const handleLogout = (event) => {
    event.stopPropagation();
    showAlert("Logout successful");
    setProfileOpen(false);
    navigate("/");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };

    if (profileOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [profileOpen]);

  return (
    <header>
      <div className="navbar">
        <Link to="/admin/dashboard">
          <h1 className="logo">Stop Crime.</h1>
        </Link>

        <nav>
          <ul className="nav-links">
            <li><Link to="/admin/dashboard">Dashboard</Link></li>
            <li><Link to="/admin/users">User Management</Link></li>
            <li><Link to="/admin/reports">Crime Reports</Link></li>
            <li><Link to="/admin/validations">Validations</Link></li>
            <li><Link to="/admin/police-alerts">Police Alerts</Link></li>
            <li><Link to="/admin/analytics">Analytics</Link></li>
            <li><Link to="/admin/settings">Settings</Link></li>
          </ul>
        </nav>

        <div className="auth-links">
          {location.pathname === "/signup" ? (
            <Link to="/" className="sign-up-btn">Sign In</Link>
          ) : location.pathname === "/login" ? (
            <Link to="/signup" className="sign-up-btn">Sign Up</Link>
          ) : (
            <button onClick={toggleProfilePopup} className="profile-btn">
              {userName}
            </button>
          )}
        </div>
      </div>

      {profileOpen && (
        <>
          <div className="overlay" onClick={() => setProfileOpen(false)}></div>
          <div className="profile-popup" ref={popupRef}>
            <div className="profile-header">
              <h2>{userName}</h2>
              <span className="rank">Gold</span>
            </div>
            <p><strong>Username :</strong> {userName}</p>
            <p><strong>Stats :</strong> Platinum</p>
            <p><strong>Earned Points :</strong> 1200</p>
            <button className="logout-btn" onClick={handleLogout}>Logout</button>
          </div>
        </>
      )}
    </header>
  );
};

export default NavbarAdmin;
