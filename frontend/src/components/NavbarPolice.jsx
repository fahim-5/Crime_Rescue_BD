import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Navbar.css";
import "./profile_popup.css";

const NavbarPolice = () => {
  const [profileOpen, setProfileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const popupRef = useRef(null);

  // Default user name (Fallback if not logged in)
  const userName = "Guest"; 

  const toggleProfilePopup = () => {
    setProfileOpen((prev) => !prev);
  };

  const showAlert = (message, type = "info") => {
    const alertBox = document.createElement("div");
    alertBox.classList.add("custom-alert", `alert-${type}`, "show");
    alertBox.innerHTML = `${message} <span class="alert-close">&times;</span>`;

    document.body.appendChild(alertBox);

    // Close alert when clicked
    alertBox.querySelector(".alert-close").addEventListener("click", () => {
      alertBox.style.opacity = "0";
      setTimeout(() => alertBox.remove(), 400);
    });

    // Auto-remove after 3 seconds
    setTimeout(() => {
      alertBox.style.opacity = "0";
      setTimeout(() => alertBox.remove(), 400);
    }, 3000);
  };

  const handleLogout = (event) => {
    event.stopPropagation();
    showAlert("Logout successful", "success");
    setProfileOpen(false); // Close the popup
    navigate("/"); // Redirect to login page
  };

  // Close the profile popup when clicking outside of it
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
        <Link to="/" className="logo">
          <h1>Stop Crime.</h1>
        </Link>

        {/* Navigation for Police */}
        <nav className="police-nav">
          <div className="nav-section">
            <h4>Crime Reports</h4>
            <Link to="/police/reports">All Reports</Link>
            <Link to="/police/map">Crime Map</Link>
          </div>
          <div className="nav-section">
            <h4>Case Management</h4>
            <Link to="/police/pending">Pending Cases</Link>
            <Link to="/police/resolved">Resolved Cases</Link>
          </div>
        </nav>

        {/* Authentication Links */}
        <div className="auth-links">
          {location.pathname === "/signup" ? (
            <Link to="/" className="sign-up-btn">Sign In</Link>
          ) : location.pathname === "/login" ? (
            <Link to="/" className="sign-up-btn">Sign Up</Link>
          ) : (
            <button onClick={toggleProfilePopup} className="profile-btn">
              {userName}
            </button>
          )}
        </div>
      </div>

      {/* Profile Pop-up */}
      {profileOpen && (
        <>
          <div className="overlay" onClick={() => setProfileOpen(false)}></div>
          <div className="profile-popup" ref={popupRef}>
            <div className="profile-header">
              <h2>{userName}</h2>
              <span className="rank">Gold</span>
            </div>
            <p><strong>Username:</strong> {userName}</p>
            <p><strong>Stats:</strong> Platinum</p>
            <p><strong>Earned Points:</strong> 1200</p>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </>
      )}
    </header>
  );
};

export default NavbarPolice;
