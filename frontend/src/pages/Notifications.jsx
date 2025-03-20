import React from "react";
import "./Notifications.css"; // CSS for styling

const Notifications = () => {
    return (
        <main className="notifications-container">
            <h1>Recent Notifications</h1>
            <div className="notification">
                <p><strong>Crime Alert:</strong> A robbery was reported near Main Street. Stay alert and report any suspicious activity.</p>
                <span className="timestamp">10 minutes ago</span>
            </div>
            <div className="notification">
                <p><strong>Police Update:</strong> A suspect has been apprehended in the downtown mugging case.</p>
                <span className="timestamp">30 minutes ago</span>
            </div>
            <div className="notification">
                <p><strong>Community Report:</strong> Vandalism spotted near City Park. Awaiting validation from other users.</p>
                <span className="timestamp">1 hour ago</span>
            </div>
        </main>
    );
};

export default Notifications;
