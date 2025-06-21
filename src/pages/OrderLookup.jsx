import React, { useState } from "react";
import axios from "axios";

export default function OrderLookup() {
  const [email, setEmail] = useState("");
  const [shortId, setShortId] = useState("");
  const [error, setError] = useState("");

  const handleLookup = async () => {
    if (!email || !shortId) {
      setError("Please fill in both fields.");
      return;
    }

    try {
      const res = await axios.get(`https://gagbest.onrender.com/api/lookup-order?email=${email}&short=${shortId}`);
      const longId = res.data.id;
      window.location.href = `/?id=${longId}`;
    } catch (err) {
      setError("Order not found. Please check your info.");
    }
  };

  return (
    <div className="lookup-container">
      <h1>Locate Your Order</h1>
      <input
        type="email"
        placeholder="Your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="text"
        placeholder="Short Order Number"
        value={shortId}
        onChange={(e) => setShortId(e.target.value)}
      />
      <button onClick={handleLookup}>Continue</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
