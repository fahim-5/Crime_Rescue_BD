// src/pages/Home.jsx

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth"; // Correctly import the useAuth hook
import "./Home.css"; // Updated CSS file

const Home = () => {
    const { user } = useAuth(); // Destructure user from useAuth hook
    const [profileOpen, setProfileOpen] = useState(false);
    const navigate = useNavigate(); // Initialize navigate

    // Toggle profile popup visibility
    const toggleProfile = () => {
        setProfileOpen(!profileOpen);
    };

    useEffect(() => {
        // Optionally, you can check if the user is authenticated or not
        if (!user) {
            // If not logged in, redirect to login page (for example)
            navigate("/login");
        }
    }, [user, navigate]);

    return (
        <div className="home-container">
            <section className="welcome-section">
                <h1 className="welcome-heading">Welcome to Safe Society</h1>
                <p className="welcome-text">
                    Stay alert, stay safe! Report crimes in real-time and help us keep your community safe. Your involvement is vital.
                </p>

                {/* Conditionally render based on user */}
                {user ? (
                    <div>
                        <p>Welcome back, {user.full_name || user.username}!</p> {/* Display the user's name */}
                        <button className="report-button" onClick={() => navigate("/report")}>Report a Crime</button>
                    </div>
                ) : (
                    <p>Please sign in to report crimes and stay safe.</p>
                )}

                <p className="cta-text">
                    Already reported? You can view or validate reports <a href="/reports" className="cta-link">here</a>.
                </p>
            </section>

            {/* Optional Profile Popup */}
            {profileOpen && (
                <div className="profile-popup">
                    <p>User Profile</p>
                    {/* Render more user details here */}
                    <button onClick={toggleProfile}>Close</button>
                </div>
            )}
        </div>
    );
};

export default Home;
