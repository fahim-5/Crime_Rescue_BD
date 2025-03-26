// Validations.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Validations.css";

const Validations = () => {
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch pending police requests
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.get("http://localhost:5000/police/requests");
        // If you keep the backend response structure, use:
        // setRequests(response.data.data); 
        // After fixing the backend to return direct array:
        setRequests(response.data);
      } catch (err) {
        setError("Failed to fetch requests");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  const handleApprove = async (id) => {
    try {
      await axios.patch(`http://localhost:5000/police/requests/${id}`, { status: "approved" });
      setRequests(requests.filter((req) => req._id !== id));
    } catch (err) {
      setError("Failed to approve request");
    }
  };

  const handleReject = async (id) => {
    try {
      await axios.patch(`http://localhost:5000/police/requests/${id}`, { status: "rejected" });
      setRequests(requests.filter((req) => req._id !== id));
    } catch (err) {
      setError("Failed to reject request");
    }
  };

  const viewDetails = (request) => {
    setSelectedRequest(request);
  };

  if (loading) return <div className="loading">Loading requests...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="validation-container">
      <h1>Police Registration Requests</h1>
      
      <div className="requests-table">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Police ID</th>
              <th>Station</th>
              <th>Rank</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((request) => (
              <tr key={request._id}>
                <td>{request.full_name}</td>
                <td>{request.police_id}</td>
                <td>{request.station}</td>
                <td>{request.rank}</td>
                <td className="actions">
                  <button className="view-btn" onClick={() => viewDetails(request)}>View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedRequest && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-modal" onClick={() => setSelectedRequest(null)}>&times;</button>
            <h2>Officer Details</h2>
            <div className="detail-grid">
              <div className="detail-group">
                <h3>Identification</h3>
                <p><strong>Full Name:</strong> {selectedRequest.full_name}</p>
                <p><strong>Police ID:</strong> {selectedRequest.police_id}</p>
                <p><strong>Badge Number:</strong> {selectedRequest.badge_number}</p>
              </div>
              <div className="detail-group">
                <h3>Assignment</h3>
                <p><strong>Station:</strong> {selectedRequest.station}</p>
                <p><strong>Rank:</strong> {selectedRequest.rank}</p>
                <p><strong>Joining Date:</strong> {new Date(selectedRequest.joining_date).toLocaleDateString()}</p>
              </div>
              <div className="detail-group">
                <h3>Contact</h3>
                <p><strong>Email:</strong> {selectedRequest.email}</p>
                <p><strong>Mobile:</strong> {selectedRequest.mobile}</p>
              </div>
            </div>
            <div className="modal-actions">
              <button className="approve-btn" onClick={() => { handleApprove(selectedRequest._id); setSelectedRequest(null); }}>Approve</button>
              <button className="reject-btn" onClick={() => { handleReject(selectedRequest._id); setSelectedRequest(null); }}>Reject</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Validations;

