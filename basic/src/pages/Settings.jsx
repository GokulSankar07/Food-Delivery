import React, { useState } from "react";
import "./settings.css"; // import CSS

const Settings = () => {
  const [email, setEmail] = useState("customer@example.com");
  const [phone, setPhone] = useState("9876543210");
  const [password, setPassword] = useState("");
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    alert("Settings updated successfully ✅");
    // Here you can call your backend API to save settings
  };

  return (
    <div className={`settings-container ${darkMode ? "dark" : ""}`}>
      <h1>Account Settings</h1>

      <form onSubmit={handleSave} className="settings-form">
        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label>Phone Number</label>
        <input
          type="text"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <label>New Password</label>
        <input
          type="password"
          placeholder="Enter new password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <div className="settings-option">
          <label>
            <input
              type="checkbox"
              checked={notifications}
              onChange={() => setNotifications(!notifications)}
            />
            Enable Notifications
          </label>
        </div>

        <div className="settings-option">
          <label>
            <input
              type="checkbox"
              checked={darkMode}
              onChange={() => setDarkMode(!darkMode)}
            />
            Enable Dark Mode
          </label>
        </div>

        <button type="submit" className="save-btn">
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default Settings;
