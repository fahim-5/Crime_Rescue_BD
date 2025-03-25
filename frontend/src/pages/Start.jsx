import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Start.module.css"; // Import module CSS

const Start = () => {
  const [role, setRole] = useState("");
  const [alertMessage, setAlertMessage] = useState(""); // State for alert message
  const [adminPassword, setAdminPassword] = useState(""); // State for admin password input
  const [showPasswordPopup, setShowPasswordPopup] = useState(false); // State for password popup
  const navigate = useNavigate();

  const handleNext = () => {
    if (!role) {
      setAlertMessage("Please select a role to proceed.");
      return;
    }

    if (role === "admin") {
      setShowPasswordPopup(true);
      return;
    }

    navigateToRolePage();
  };

  const navigateToRolePage = () => {
    const routes = {
      general: "/public-signup",
      police: "/police-signup",
      admin: "/admin-signup",
    };
    navigate(routes[role]);
  };

  const handleAdminSubmit = () => {
    if (adminPassword === "1234") {
      navigateToRolePage();
    } else {
      setAlertMessage("Incorrect password. Please try again.");
    }
  };

  return (
    <div className={styles.startContainer} onClick={() => setAlertMessage("")}>
      {/* Alert Box - Shows when there's an alert */}
      {alertMessage && <div className={styles.alertBox}>{alertMessage}</div>}

      <div className={styles.startBox} onClick={(e) => e.stopPropagation()}>
        <h1 className={styles.startHeading}>Create a Safer Tomorrow</h1>
        <h3 className={styles.startSubheading}>Start Today</h3>

        <p className={styles.startText}>Choose your role to proceed with registration:</p>

        <div className={styles.roleOptions}>
          {["general", "police", "admin"].map((type) => (
            <label key={type} className={styles.roleLabel}>
              <input
                type="radio"
                name="role"
                value={type}
                onChange={(e) => {
                  setRole(e.target.value);
                  setShowPasswordPopup(false);
                }}
              />
              {type === "general"
                ? "General User (Public)"
                : type === "police"
                ? "Government Authority (Police)"
                : "Admin"}
            </label>
          ))}
        </div>

        <button className={styles.nextButton} onClick={handleNext}>
          Next
        </button>
      </div>

      {/* Admin Password Popup */}
      {showPasswordPopup && (
        <div className={styles.popupOverlay}>
          <div className={styles.popupBox} onClick={(e) => e.stopPropagation()}>
            <h3 className={styles.popupTitle}>Enter Admin Password</h3>
            <input
              type="password"
              className={styles.popupInput}
              placeholder="Enter Password"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
            />
            <div className={styles.popupButtons}>
              <button className={styles.popupConfirm} onClick={handleAdminSubmit}>
                Submit
              </button>
              <button className={styles.popupCancel} onClick={() => setShowPasswordPopup(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Start;
