import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import "../Claim.css";

export default function App() {
  const [params] = useSearchParams();
  const [step, setStep] = useState(1);
  const [orderStatus, setOrderStatus] = useState(null);
  const [username, setUsername] = useState("");
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState("");

  const [email, setEmail] = useState("");
  const [shortId, setShortId] = useState("");

  const orderId = params.get("id");

  // STEP 0: Manual lookup
  if (!orderId) {
    return (
      <div className="main">
        <h1>Locate Your Order</h1>
        <input
          placeholder="Your Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          placeholder="Short Order Number"
          value={shortId}
          onChange={(e) => setShortId(e.target.value)}
        />
        <button
          onClick={async () => {
            if (!email || !shortId) return setError("Enter both fields.");
            try {
              const res = await axios.get(`https://gagbest.onrender.com/api/lookup-order?email=${email}&short=${shortId}`);
              const fullOrderId = res.data.id;
              window.location.href = `/?id=${fullOrderId}`;
            } catch {
              setError("Order not found.");
            }
          }}
        >
          Find My Order
        </button>
        {error && <p className="error-message" style={{ color: "red" }}>{error}</p>}
      </div>
    );
  }

  // STEP 1: Load Order by ID
  useEffect(() => {
    if (orderId) {
      axios
        .get(`https://gagbest.onrender.com/api/check-order?id=${orderId}`)
        .then((res) => {
          setOrderStatus(res.data.order);
          setStep(1);
        })
        .catch(() => setError("Invalid or fulfilled order."));
    }
  }, [orderId]);

  const handleUsername = () => {
    setError("");
    setUserData(null);
    if (!username) {
      setError("Please enter your Roblox username.");
      return;
    }

    axios
      .get(`https://gagbest.onrender.com/api/roblox-user?username=${username}`)
      .then((res) => {
        setUserData(res.data);
        setStep(2);
      })
      .catch(() => setError("❌ Roblox user not found. Try a different one."));
  };

  if (!orderStatus)
    return <div className="main">🔄 Loading order...</div>;

  return (
    <div className="container">
      <div className="sidebar">
        <img
          className="logo"
          src="https://cdn.discordapp.com/attachments/1384676331660509337/1385773276902457475/GAGBESTLOGO.png"
          alt="GAG.BEST Logo"
        />
        <div className="stepper">
          <div className={`step ${step === 1 ? "" : "processing"}`}>
            <div className="icon">✅</div>
            <div className="content">
              <p>Step 1</p>
              <h1>Locate your Account</h1>
              <span>{step === 1 ? "IN PROGRESS" : "COMPLETE"}</span>
            </div>
          </div>
          <div className={`step ${step < 2 ? "processing" : ""}`}>
            <div className="icon">👤</div>
            <div className="content">
              <p>Step 2</p>
              <h1>Confirm your Account</h1>
              <span>{step === 2 ? "IN PROGRESS" : "PROCESSING"}</span>
            </div>
          </div>
          <div className={`step ${step < 3 ? "processing" : ""}`}>
            <div className="icon">🔒</div>
            <div className="content">
              <p>Step 3</p>
              <h1>Change Privacy Setting</h1>
              <span>{step === 3 ? "IN PROGRESS" : "PROCESSING"}</span>
            </div>
          </div>
          <div className={`step ${step < 4 ? "processing" : ""}`}>
            <div className="icon">🎁</div>
            <div className="content">
              <p>Step 4</p>
              <h1>Join Game & Get Items</h1>
              <span>{step === 4 ? "IN PROGRESS" : "PROCESSING"}</span>
            </div>
          </div>
        </div>
        <div className="helper">
          <img
            src="https://cdn-icons-png.flaticon.com/512/5968/5968756.png"
            alt="Discord Icon"
          />
          <span>
            Need help? <a href="#">View our Tutorial</a>
          </span>
        </div>
      </div>

      <div className="main">
        <h1>Claim Your Order</h1>
        <p>Order ID: <strong>{orderId}</strong></p>

        {step === 1 && (
          <>
            <p>Let's locate your account to initiate the claiming process.</p>
            <input
              placeholder="Your Roblox Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <button onClick={handleUsername}>Continue</button>
            {error && <p className="error-message" style={{ color: "red", marginTop: 8 }}>{error}</p>}
          </>
        )}

        {step === 2 && userData && (
          <>
            <h3>Confirm This is You:</h3>
            <div className="user-info">
              <strong>{userData.displayName || userData.name}</strong>
              <br />
              ID: {userData.id}
            </div>
            <button onClick={() => setStep(3)}>Yes, that's me</button>
            <button onClick={() => { setUserData(null); setStep(1); }}>Cancel</button>
          </>
        )}

        {step === 3 && (
          <>
            <h3>Change Your Privacy Setting</h3>
            <p>
              We need to join you in-game. Please make sure your Roblox privacy
              settings allow users to join your games.
            </p>
            <img
              src="https://cdn.discordapp.com/attachments/1384676331660509337/1385773731284267119/privacy_setting.png"
              alt="How to change privacy setting"
              style={{
                maxWidth: "100%",
                borderRadius: "12px",
                boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
              }}
            />
            <div style={{ marginTop: "16px" }}>
              <button
                onClick={() =>
                  window.open(
                    "https://www.roblox.com/my/account#!/privacy/VisibilityAndPrivateServers/Visibility",
                    "_blank"
                  )
                }
              >
                Open Privacy Settings
              </button>
              <button
                style={{ marginLeft: "12px" }}
                onClick={() => setStep(4)}
              >
                Next Step
              </button>
            </div>
          </>
        )}

        {step === 4 && (
          <>
            <h3>Join Game & Get Items</h3>
            <p>You're ready! Please join the delivery game now and your items will be delivered shortly.</p>
            <a
              href="https://www.roblox.com/games/15922923665/Claim-Delivery"
              target="_blank"
              rel="noopener noreferrer"
            >
              <button>Join Game</button>
            </a>
          </>
        )}
      </div>
    </div>
  );
}
