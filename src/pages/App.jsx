
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";

export default function App() {
  const [params] = useSearchParams();
  const [step, setStep] = useState(1);
  const [orderStatus, setOrderStatus] = useState(null);
  const [username, setUsername] = useState("");
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState("");

  const orderId = params.get("id");

  useEffect(() => {
    if (orderId) {
      axios.get(`https://gagbest.onrender.com/api/check-order?id=${orderId}`)
        .then(res => {
          setOrderStatus(res.data.order);
          setStep(1);
        })
        .catch(() => setError("Invalid or fulfilled order."));
    }
  }, [orderId]);

  const handleUsername = () => {
    if (!username) return;
    axios.get(`https://gagbest.onrender.com/api/roblox-user?username=${username}`)
      .then(res => {
        setUserData(res.data);
        setStep(2);
      })
      .catch(() => setError("Roblox user not found."));
  };

  if (error) return <div style={{ padding: 30, fontFamily: "sans-serif" }}>❌ {error}</div>;
  if (!orderStatus) return <div style={{ padding: 30, fontFamily: "sans-serif" }}>🔄 Loading order...</div>;

  return (
    <div style={{ fontFamily: "sans-serif", padding: 30 }}>
      <h1>Claim Your Order</h1>
      <p>Order ID: <strong>{orderId}</strong></p>

      {step === 1 && (
        <div>
          <h3>Step 1: Enter your Roblox Username</h3>
          <input placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
          <button onClick={handleUsername}>Continue</button>
        </div>
      )}

      {step === 2 && userData && (
        <div>
          <h3>Confirm This is You:</h3>
          <p><strong>{userData.displayName || userData.name}</strong> (ID: {userData.id})</p>
          <button onClick={() => alert("Next step placeholder")}>Yes, that's me</button>
          <button onClick={() => { setUserData(null); setStep(1); }}>Cancel</button>
        </div>
      )}
    </div>
  );
}
