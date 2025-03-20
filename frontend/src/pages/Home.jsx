import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css"; // Updated CSS file

const Home = () => {
    const [profileOpen, setProfileOpen] = useState(false);
    const navigate = useNavigate(); // Initialize navigate

    const toggleProfile = () => {
        setProfileOpen(!profileOpen);
    };

    return (
        <div className="home-container">
            <section className="welcome-section">
                <h1 className="welcome-heading">Welcome to Safe Society</h1>
                <p className="welcome-text">Stay alert, stay safe! Report crimes in real-time and help us keep your community safe. Your involvement is vital.</p>
                <button className="report-button" onClick={() => navigate("/report")}>Report a Crime</button>
                <p className="cta-text">
                    Already reported? You can view or validate reports <a href="/reports" className="cta-link">here</a>.
                </p>
            </section>
        </div>
    );
};

export default Home;
