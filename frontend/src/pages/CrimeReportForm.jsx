import React from "react";
import "./CrimeReportForm.css"

const CrimeReportForm = () => {
  return (
    <main>
      <section className="report-form">
        <h2>Report a Crime</h2>
        <form action="#">
          {/* Location Input */}
          <label htmlFor="location">Crime Location</label>
          <input
            type="text"
            id="location"
            name="location"
            placeholder="Enter the location of the crime"
            required
          />

          {/* Time Input */}
          <label htmlFor="time">Time of Crime</label>
          <input type="datetime-local" id="time" name="time" required />

          {/* Type of Crime */}
          <label htmlFor="crime-type">Type of Crime</label>
          <select id="crime-type" name="crime-type" required>
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
            placeholder="How many criminals were involved?"
            required
          />

          {/* Victim Gender */}
          <label htmlFor="victim-gender">Victim's Gender</label>
          <select id="victim-gender" name="victim-gender" required>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
            <option value="unknown">Prefer not to say</option>
          </select>

          {/* Armed Criminals */}
          <label htmlFor="armed">Are the criminals armed?</label>
          <div>
            <input type="radio" id="yes" className="yes" name="armed" value="yes" required />
            <label htmlFor="yes">Yes</label>
            <input type="radio" id="no" name="armed" value="no" required />
            <label htmlFor="no">No</label>
          </div>

          {/* Submit Button */}
          <button type="submit">Submit Report</button>
        </form>
      </section>
    </main>
  );
};

export default CrimeReportForm;
