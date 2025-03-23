import React, { useState } from "react";
import "./CrimeReportForm.css";
import { FaMapMarkerAlt } from "react-icons/fa";
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

  const handlePhotoChange = (event) => {
    const files = Array.from(event.target.files);
    setPhotos([...photos, ...files]);
  };

  const handleVideoChange = (event) => {
    const files = Array.from(event.target.files);
    setVideos([...videos, ...files]);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Form Submitted:", {
      location,
      time,
      photos,
      videos,
      crimeType,
      numCriminals,
      victimGender,
      armed,
    });
  };

  const handleMapButtonClick = () => {
    // Opens the location in Google Maps when the button is clicked
    window.open(
      `https://www.google.com/maps?q=${encodeURIComponent(location)}`,
      "_blank"
    );
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
              placeholder="Enter or select the location"
              value={location}
              onChange={(e) => setLocation(e.target.value)} // Allow manual entry
            />
            <button
              type="button"
              className="map-button"
              onClick={handleMapButtonClick}
            >
              <FaMapMarkerAlt size={20} />
            </button>
          </div>

          <label htmlFor="time">Time of Crime</label>
          <div className="datepicker-container">
            <DatePicker
              selected={time}
              onChange={(date) => setTime(date)}
              showTimeSelect
              dateFormat="Pp"
              className="datepicker-input"
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

          {/* Victim Gender */}
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
            <input
              type="radio"
              id="yes"
              name="armed"
              value="yes"
              checked={armed === "yes"}
              onChange={() => setArmed("yes")}
              required
            />
            <label htmlFor="yes">Yes</label>
            <input
              type="radio"
              id="no"
              name="armed"
              value="no"
              checked={armed === "no"}
              onChange={() => setArmed("no")}
              required
            />
            <label htmlFor="no">No</label>
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
                  Remove
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
                  Remove
                </button>
              </div>
            ))}
          </div>

          {/* Submit Button */}
          <button type="submit">Submit Report</button>
        </form>
      </section>
    </main>
  );
};

export default CrimeReportForm;
