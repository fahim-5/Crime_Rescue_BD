import React from "react";
import "./Footer.css";
// Import Font Awesome icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebook, faTwitter, faInstagram, faLinkedin } from "@fortawesome/free-brands-svg-icons";

const Footer = () => {
    return (
        <footer>
            <div className="footer-content">
                {/* About Section */}
                <div className="footer-section about">
                    <h2>About Us</h2>
                    <p>
                        Live Crime Reporting is dedicated to providing a platform for citizens 
                        to report crimes in real-time, contributing to safer communities.
                    </p>
                </div>

                {/* Quick Links Section */}
                <div className="footer-section links">
                    <h2>Quick Links</h2>
                    <ul>
                        <li><a href="/">Home</a></li>
                        <li><a href="/report">Report a Crime</a></li>
                        <li><a href="/notifications">Notifications</a></li>
                        <li><a href="/alert">Alert</a></li>
                        <li><a href="/about">About Us</a></li>
                    </ul>
                </div>

                {/* Contact Section */}
                <div className="footer-section contact">
                    <h2>Contact Us</h2>
                    <p>Email: mfaysal223224@bscse.uiu.ac.bd</p>
                    <p>Phone: +880 1774071130</p>
                </div>

                {/* Social Media Section */}
                <div className="footer-section social">
                    <h2>Follow Us</h2>
                    <div className="social-icons">
                        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-icon">
                            <FontAwesomeIcon icon={faFacebook} />
                        </a>
                        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-icon">
                            <FontAwesomeIcon icon={faTwitter} />
                        </a>
                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-icon">
                            <FontAwesomeIcon icon={faInstagram} />
                        </a>
                        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-icon">
                            <FontAwesomeIcon icon={faLinkedin} />
                        </a>
                    </div>
                </div>
            </div>

            {/* Footer Bottom */}
            <div className="footer-bottom">
                <p>&copy; 2025 Live Crime Reporting. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
