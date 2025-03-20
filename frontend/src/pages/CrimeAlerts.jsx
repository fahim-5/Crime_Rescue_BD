import React, { useState } from "react";
import "./CrimeAlerts.css"; // CSS for styling

const CrimeAlerts = () => {
    const [popupVisible, setPopupVisible] = useState(false);
    const [crimeDetails, setCrimeDetails] = useState({});

    // Function to show the popup with details
    const showPopup = (event) => {
        const { location, time, type, people, victim, armed } = event.target.dataset;
        
        setCrimeDetails({
            location,
            time,
            type,
            people,
            victim,
            armed,
        });

        setPopupVisible(true);
    };

    // Function to hide the popup
    const closePopup = () => {
        setPopupVisible(false);
    };

    return (
        <main className="notifications-container">
            <h1>Recently Reported Crime</h1>

            {[...Array(4)].map((_, index) => (
                <div className="notification" key={index}>
                    <p><strong>Crime Alert:</strong> A robbery was reported near Main Street. Stay alert and report any suspicious activity.</p>
                    <span className="timestamp">10 minutes ago</span>
                    <button 
                        className="details-btn" 
                        data-location="Main Street" 
                        data-time="10:30 PM" 
                        data-type="Robbery" 
                        data-people="2" 
                        data-victim="Male" 
                        data-armed="Yes"
                        onClick={showPopup}
                    >
                        Details
                    </button>
                </div>
            ))}

            {/* Popup Component */}
            {popupVisible && (
                <div className="popup" id="crime-popup">
                    <div className="popup-content">
                        <span className="close-btn" onClick={closePopup}>&times;</span>
                        <h1>Crime Details</h1>
                        <p><strong>Location:</strong> <span>{crimeDetails.location}</span></p>
                        <p><strong>Time:</strong> <span>{crimeDetails.time}</span></p>
                        <p><strong>Type of Crime:</strong> <span>{crimeDetails.type}</span></p>
                        <p><strong>People Involved:</strong> <span>{crimeDetails.people}</span></p>
                        <p><strong>Victim Gender:</strong> <span>{crimeDetails.victim}</span></p>
                        <p><strong>Criminal Armed:</strong> <span>{crimeDetails.armed}</span></p>
                    </div>
                </div>
            )}
        </main>
    );
};

export default CrimeAlerts;
