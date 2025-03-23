import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Navbar.css";
import "./profile_popup.css";

const Navbar = () => {
  const [profileOpen, setProfileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const popupRef = useRef(null);

  const userName = "Fahim"; // Dummy user name for logged-in state

  const toggleProfilePopup = () => {
    setProfileOpen((prev) => !prev);
  };


  function showAlert(message, type = "info") {
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
}

// Example Usage
// showAlert("Success! Your item has been updated.", "success");
// showAlert("Error! Something went wrong.", "error");
// showAlert("Warning! This action cannot be undone.", "warning");
// showAlert("Info: Your session will expire soon.", "info");


  const handleLogout = (event) => {
    event.stopPropagation(); // Prevents event bubbling
   showAlert("Logout succesful");
    setProfileOpen(false); // Close the popup
    navigate("/login"); // Redirect to login page
  };

  // Close the popup when clicking outside of it
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
        <Link to="/">
          <h1 className="logo">Stop Crime.</h1>
        </Link>

        <nav>
          <ul className="nav-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/report">Report</Link></li>
            <li><Link to="/notifications">Notifications</Link></li>
            <li><Link to="/alert">Alert</Link></li>
            <li><Link to="/about">About Us</Link></li>
          </ul>
        </nav>

        <div className="auth-links">
          {location.pathname === "/signup" ? (
            <Link to="/login" className="sign-up-btn">Sign In</Link>
          ) : location.pathname === "/login" ? (
            <Link to="/signup" className="sign-up-btn">Sign Up</Link>
          ) : userName ? (
            <button onClick={toggleProfilePopup} className="profile-btn">
              {userName}
            </button>
          ) : (
            <Link to="/login" className="sign-up-btn">Sign In</Link>
          )}
        </div>
      </div>

      {/* Profile Pop-up */}
      {profileOpen && (
        <>
          <div className="overlay" onClick={() => setProfileOpen(false)}></div>
          <div className="profile-popup" ref={popupRef}>
            <div className="profile-header">
              <h2>Fahim Faysal</h2>
              <span className="rank">Gold</span>
            </div>
            <p><strong>Username :</strong> {userName}</p>
            <p><strong>Stats :</strong> Platinum</p>
            <p><strong>Earned Points :</strong> 1200</p>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </>
      )}
    </header>
  );
};

export default Navbar;
