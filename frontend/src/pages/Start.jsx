import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Start.module.css"; // Import module CSS

const Start = () => {
  const [role, setRole] = useState("");
  const [alertMessage, setAlertMessage] = useState(""); // State for alert message
  const navigate = useNavigate();

  const handleNext = () => {
    if (!role) {
      setAlertMessage("Please select a role to proceed.");
      return;
    }
    if (role === "general") {
      navigate("/public-signup");
    } else if (role === "police") {
      navigate("/police-signup");
    } else if (role === "admin") {
      navigate("/admin-signup");
    }
  };

  // Hide alert on clicking anywhere
  const handleDismiss = () => {
    setAlertMessage("");
  };

  return (
    <div className={styles.startContainer} onClick={handleDismiss}>
      {/* Alert Box - Shows when there's an alert */}
      {alertMessage && <div className={styles.alertBox}>{alertMessage}</div>}

      <div className={styles.startBox} onClick={(e) => e.stopPropagation()}>
        <h1 className={styles.startHeading}>Create a Safer Tomorrow  <h3>Start Today</h3></h1>
        <p className={styles.startText}>Choose your role to proceed with registration:</p>

        <div className={styles.roleOptions}>
          <label className={styles.roleLabel}>
            <input
              type="radio"
              name="role"
              value="general"
              onChange={(e) => setRole(e.target.value)}
            />
            General User (Public)
          </label>

          <label className={styles.roleLabel}>
            <input
              type="radio"
              name="role"
              value="police"
              onChange={(e) => setRole(e.target.value)}
            />
            Government Authority (Police)
          </label>

          <label className={styles.roleLabel}>
            <input
              type="radio"
              name="role"
              value="admin"
              onChange={(e) => setRole(e.target.value)}
            />
            Admin
          </label>
        </div>

        <button className={styles.nextButton} onClick={handleNext}>
          Next
        </button>
      </div>
    </div>
  );
};

export default Start;
