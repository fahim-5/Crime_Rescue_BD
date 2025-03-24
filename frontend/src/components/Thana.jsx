import React, { useState } from "react";
import "./Than.css";

const Thana = () => {
  const allThanNames = [
    "Dhaka", "Chittagong", "Khulna", "Rajshahi", "Sylhet", "Barisal", "Mymensingh", "Rangpur",
    "Narayanganj", "Gazipur", "Narsingdi", "Tangail", "Munshiganj", "Manikganj", "Moulvibazar",
    "Cox's Bazar", "Feni", "Rangamati", "Khagrachari", "Bandarban", "Comilla", "Bagerhat", "Satkhira",
    "Jessore", "Meherpur", "Chuadanga", "Naogaon", "Bogura", "Pabna", "Chapainawabganj", "Sirajganj",
    "Habiganj", "Sunamganj", "Patuakhali", "Bhola", "Jhalokathi", "Jamalpur", "Netrokona", "Sherpur",
    "Kurigram", "Dinajpur", "Thakurgaon", "Lalmonirhat", "Gaibandha", "Moulvibazar", "Magura", 
    "Rajbari", "Netrakona", "Shariatpur", "Chandpur", "Pirojpur", "Barisal", "Brahmanbaria", 
    "Chattogram", "Madaripur", "Kishoreganj", "Savar", "Feni", "Moulvibazar", "Lakshmipur", 
    "Sylhet", "Pabna", "Rajshahi", "Chapainawabganj", "Kushtia", "Jhenidah", "Jhenaidah", "Meherpur", 
    "Bhola", "Mymensingh", "Dinajpur", "Chattagram", "Gopalganj", "Bogra", "Chittagong", "Pabna",
    "Rangamati", "Khulna", "Gopalganj", "Moulvibazar", "Bogra", "Meherpur", "Satkhira", 
    "Chandpur", "Kushtia", "Sirajganj", "Bhola", "Chittagong", "Chandpur", "Rangpur", "Gopalganj",
    "Shariatpur", "Kurigram", "Sherpur", "Sundarganj", "Gaibandha", "Khagrachari", "Madaripur",
    "Thakurgaon", "Brahmanbaria", "Kishoreganj", "Madaripur", "Satkhira", "Brahmanbaria"
  ];

  const [formData, setFormData] = useState({
    address: "",
  });

  const [suggestions, setSuggestions] = useState([]);
  const [isFocused, setIsFocused] = useState(false);

  const handleChange = (e) => {
    const value = e.target.value;
    setFormData({
      ...formData,
      address: value,
    });

    // Filter thanas based on user input
    if (value) {
      const filteredSuggestions = allThanNames.filter((thana) =>
        thana.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  const handleSelect = (selectedThana) => {
    setFormData({
      ...formData,
      address: selectedThana, // This will fill the input field with the selected suggestion
    });
    setSuggestions([]); // Clear suggestions after selection
  };

  return (
    <div>
      <label htmlFor="address" className="auth-label">
        Address (Only Thana)
      </label>
      <input
        type="text"
        id="address"
        name="address"
        className="auth-input"
        placeholder="Enter your Thana"
        value={formData.address}
        onChange={handleChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setTimeout(() => setIsFocused(false), 100)} // Delay to handle click on suggestion
        required
      />

      {isFocused && suggestions.length > 0 && (
        <ul className="suggestions-list">
          {suggestions.map((thana, index) => (
            <li key={index} onClick={() => handleSelect(thana)}>
              {thana}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Thana;
