import React from 'react';
import "./About.css"

const About = () => {
    return (
        <main>
            <section className="intro">
                <div className="content-container">
                    <h2>Welcome to the Live Crime Reporting System</h2>
                    <p>Our platform enables users to report crimes in real time, ensuring the safety and security of their
                        communities. By using our system, you can contribute to making your area safer by reporting crimes
                        and helping others validate incidents.</p>
                </div>
            </section>

            <section className="features">
                <div className="feature">
                    <h3>Real-time Crime Reporting</h3>
                    <p>Report crimes instantly as you witness or experience them. Your report can be verified by nearby
                        users to help local authorities respond quickly.</p>
                </div>
                <div className="feature">
                    <h3>Validation System</h3>
                    <p>Reports can be validated by other users within a 1 km radius. When multiple validations are
                        submitted, an alert is sent to the local police.</p>
                </div>
                <div className="feature">
                    <h3>Instant Notifications</h3>
                    <p>Get notified about crimes happening near you, and contribute to your community's safety by verifying
                        reports and staying informed.</p>
                </div>
            </section>

            <section className="how-it-works">
                <h3>How It Works</h3>
                <div className="steps">
                    <div className="step">
                        <h4>Step 1: Register</h4>
                        <p>Sign up using your National ID card to create an account on the platform.</p>
                    </div>
                    <div className="step">
                        <h4>Step 2: Report</h4>
                        <p>Report any crime you witness or experience by providing details about the incident and its
                            location.</p>
                    </div>
                    <div className="step">
                        <h4>Step 3: Validate</h4>
                        <p>Other users near the crime scene can validate the report. Once five validations are received, the
                            police are notified.</p>
                    </div>
                </div>
            </section>
        </main>
    );
}

export default About;
