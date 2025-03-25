import React, { useState } from "react";
import "./Validations.css"; 

const Validations = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedPolice, setSelectedPolice] = useState(null);

  // Sample data for demonstration, replace with actual data from API or state
  const policeRequests = [
    { name: "John Doe", badgeId: "PD12345", department: "Dhaka Metropolitan", email: "john.doe@example.com" },
    { name: "Jane Smith", badgeId: "PD67890", department: "Chittagong", email: "jane.smith@example.com" },
  ];

  const openPopup = (police) => {
    setSelectedPolice(police);
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
    setSelectedPolice(null);
  };

  const confirmRequest = () => {
    // Handle the confirmation logic here, e.g., update police status
    alert(`Request for ${selectedPolice.name} confirmed.`);
    closePopup();
  };

  return (
    <div className="container">
      <h1>Police Account Requests</h1>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Badge ID</th>
            <th>Department</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {policeRequests.map((police, index) => (
            <tr key={index}>
              <td>{police.name}</td>
              <td>{police.badgeId}</td>
              <td>{police.department}</td>
              <td>
                <button className="check-btn" onClick={() => openPopup(police)}>
                  Check
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isPopupOpen && selectedPolice && (
        <div className="popup">
          <div className="popup-content">
            <span className="close-btn" onClick={closePopup}>
              &times;
            </span>
            <h2>Police Details</h2>
            <p><strong>Name:</strong> {selectedPolice.name}</p>
            <p><strong>Badge ID:</strong> {selectedPolice.badgeId}</p>
            <p><strong>Department:</strong> {selectedPolice.department}</p>
            <p><strong>Email:</strong> {selectedPolice.email}</p>
            <button className="confirm-btn" onClick={confirmRequest}>
              Confirm
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Validations;
