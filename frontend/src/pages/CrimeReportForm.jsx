import React, { useState } from "react";
import "./CrimeReportForm.css";
import { FaMapMarkerAlt, FaTimes, FaCheck } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const CrimeReportForm = () => {
  const [photos, setPhotos] = useState([]);
  const [videos, setVideos] = useState([]);
  const [location, setLocation] = useState("");
  const [time, setTime] = useState(new Date());
  const [crimeType, setCrimeType] = useState("theft");
  const [numCriminals, setNumCriminals] = useState("");
  const [victimGender, setVictimGender] = useState("male");
  const [armed, setArmed] = useState("yes");
  const [alert, setAlert] = useState(null);
  const photoInputRef = React.createRef();
  const videoInputRef = React.createRef();

  const handlePhotoChange = (event) => {
    const files = Array.from(event.target.files);
    setPhotos([...photos, ...files]);
  };

  const handleVideoChange = (event) => {
    const files = Array.from(event.target.files);
    setVideos([...videos, ...files]);
  };

  const showAlert = (message, type) => {
    setAlert({ message, type });
    setTimeout(() => setAlert(null), 5000);
  };

  const resetForm = () => {
    setLocation("");
    setTime(new Date());
    setCrimeType("theft");
    setNumCriminals("");
    setVictimGender("male");
    setArmed("yes");
    setPhotos([]);
    setVideos([]);
    if (photoInputRef.current) photoInputRef.current.value = "";
    if (videoInputRef.current) videoInputRef.current.value = "";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    try {
      const formData = new FormData();
      formData.append("location", location);
      formData.append("time", time.toISOString());
      formData.append("crimeType", crimeType);
      formData.append("numCriminals", numCriminals);
      formData.append("victimGender", victimGender);
      formData.append("armed", armed);
  
      photos.forEach(photo => formData.append("photos", photo));
      videos.forEach(video => formData.append("videos", video));
  
      const response = await fetch("http://localhost:5000/api/reports", {
        method: "POST",
        body: formData,
      });
  
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || "Failed to submit report");
      }
  
      resetForm();
      showAlert("Report submitted successfully!", "success");
    } catch (error) {
      console.error("Submission error:", error);
      showAlert(error.message || "Please try again later.", "error");
    }
  };

  const handleMapButtonClick = () => {
    if (location.trim()) {
      window.open(
        `https://www.google.com/maps?q=${encodeURIComponent(location)}`,
        "_blank"
      );
    }
  };

  const removePhoto = (index) => {
    const newPhotos = photos.filter((_, i) => i !== index);
    setPhotos(newPhotos);
  };

  const removeVideo = (index) => {
    const newVideos = videos.filter((_, i) => i !== index);
    setVideos(newVideos);
  };

  return (
    <main>
     {alert && (
      <>
        <div className="alert-backdrop" onClick={() => setAlert(null)} />
        <div className={`alert alert-${alert.type}`}>
          <div className="alert-content">
            {alert.type === "success" ? <FaCheck /> : <FaTimes />}
            <span className="alert-message">{alert.message}</span>
            <button onClick={() => setAlert(null)} className="alert-close">
              &times;
            </button>
          </div>
        </div>
      </>
    )}

      <section className="report-form">
        <h2>Report a Crime</h2>
        <form onSubmit={handleSubmit}>
          {/* Location Input */}
          <label htmlFor="location">Crime Location</label>
          <div className="location-input-container">
            <input
              type="text"
              id="location"
              name="location"
              placeholder="Enter location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
            <button
              type="button"
              className="map-button"
              onClick={handleMapButtonClick}
              disabled={!location.trim()}
            >
              <FaMapMarkerAlt size={20} />
            </button>
          </div>

          {/* Time of Crime */}
          <label htmlFor="time">Time of Crime</label>
          <div className="datepicker-container">
            <DatePicker
              selected={time}
              onChange={(date) => setTime(date)}
              showTimeSelect
              dateFormat="Pp"
              className="datepicker-input"
              required
            />
          </div>

          {/* Type of Crime */}
          <label htmlFor="crime-type">Type of Crime</label>
          <select
            id="crime-type"
            name="crime-type"
            value={crimeType}
            onChange={(e) => setCrimeType(e.target.value)}
            required
          >
            <option value="theft">Theft</option>
            <option value="assault">Assault</option>
            <option value="robbery">Robbery</option>
            <option value="homicide">Homicide</option>
            <option value="vandalism">Vandalism</option>
            <option value="other">Other</option>
          </select>

          {/* Number of Criminals */}
          <label htmlFor="num-criminals">Number of Criminals</label>
          <input
            type="number"
            id="num-criminals"
            name="num-criminals"
            min="1"
            value={numCriminals}
            onChange={(e) => setNumCriminals(e.target.value)}
            placeholder="How many criminals were involved?"
            required
          />

          {/* Victim's Gender */}
          <label htmlFor="victim-gender">Victim's Gender</label>
          <select
            id="victim-gender"
            name="victim-gender"
            value={victimGender}
            onChange={(e) => setVictimGender(e.target.value)}
            required
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
            <option value="unknown">Prefer not to say</option>
          </select>

          {/* Armed Criminals */}
          <label>Are the criminals armed?</label>
          <div className="radio-group">
            {['yes', 'no'].map((value) => (
              <label key={value} className="radio-label">
                <input
                  type="radio"
                  name="armed"
                  value={value}
                  checked={armed === value}
                  onChange={() => setArmed(value)}
                  required
                />
                {value.charAt(0).toUpperCase() + value.slice(1)}
              </label>
            ))}
          </div>

          {/* Upload Photos */}
          <label htmlFor="crime-photos">Upload Photos (Optional)</label>
          <input
            type="file"
            id="crime-photos"
            name="crime-photos"
            accept="image/*"
            multiple
            onChange={handlePhotoChange}
            ref={photoInputRef}
          />
          <div className="preview-container">
            {photos.map((photo, index) => (
              <div key={index} className="preview-item">
                <img
                  src={URL.createObjectURL(photo)}
                  alt="Crime Scene"
                  className="preview-image"
                />
                <button
                  type="button"
                  onClick={() => removePhoto(index)}
                  className="remove-btn"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>

          {/* Upload Video */}
          <label htmlFor="crime-video">Upload Video (Optional)</label>
          <input
            type="file"
            id="crime-video"
            name="crime-video"
            accept="video/*"
            onChange={handleVideoChange}
            ref={videoInputRef}
          />
          <div className="preview-container">
            {videos.map((video, index) => (
              <div key={index} className="preview-item">
                <video controls className="preview-video">
                  <source src={URL.createObjectURL(video)} type={video.type} />
                </video>
                <button
                  type="button"
                  onClick={() => removeVideo(index)}
                  className="remove-btn"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>

          {/* Submit Button */}
          <button type="submit" className="submit-btn">
            Submit Report
          </button>
        </form>
      </section>
    </main>
  );
};

export default CrimeReportForm;