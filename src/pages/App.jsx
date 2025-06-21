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
  const [avatarUrl, setAvatarUrl] = useState("");
  const [error, setError] = useState("");

  const [email, setEmail] = useState("");
  const [shortId, setShortId] = useState("");

  const orderId = params.get("id");

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

  const handleUsername = async () => {
    setError("");
    setUserData(null);
    setAvatarUrl("");

    if (!username) {
      setError("Please enter your Roblox username.");
      return;
    }

    try {
      const res = await axios.get(`https://gagbest.onrender.com/api/roblox-user?username=${username}`);
      setUserData(res.data);

      const thumbRes = await axios.get(`https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${res.data.id}&size=352x352&format=Png`);
      const img = thumbRes.data?.data?.[0]?.imageUrl;
      if (img) setAvatarUrl(img);

      setStep(2);
    } catch (err) {
      setError("❌ Roblox user not found. Try a different one.");
    }
  };

  if (!orderStatus) return <div className="main">🔄 Loading order...</div>;

  const stepIcons = [
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12,12A6,6,0,1,0,6,6,6.006,6.006,0,0,0,12,12ZM12,2A4,4,0,1,1,8,6,4,4,0,0,1,12,2Z"></path><path d="M12,14a9.01,9.01,0,0,0-9,9,1,1,0,0,0,2,0,7,7,0,0,1,14,0,1,1,0,0,0,2,0A9.01,9.01,0,0,0,12,14Z"></path></svg>,
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M24,12c0-1.696-.86-3.191-2.168-4.073,.301-1.548-.148-3.213-1.347-4.413-1.199-1.199-2.864-1.648-4.413-1.347-.882-1.308-2.377-2.168-4.073-2.168s-3.191,.86-4.073,2.168c-1.548-.301-3.214,.148-4.413,1.347-1.199,1.199-1.648,2.864-1.347,4.413-1.308,.882-2.168,2.377-2.168,4.073s.86,3.191,2.168,4.073c-.301,1.548,.148,3.214,1.347,4.413,1.199,1.199,2.864,1.648,4.413,1.347,.882,1.308,2.377,2.168,4.073,2.168s3.191-.86,4.073-2.168c1.548,.301,3.214-.148,4.413-1.347,1.199-1.199,1.648-2.864,1.347-4.413,1.308-.882,2.168-2.377,2.168-4.073Zm-12.091,3.419c-.387,.387-.896,.58-1.407,.58s-1.025-.195-1.416-.585l-2.782-2.696,1.393-1.437,2.793,2.707,5.809-5.701,1.404,1.425-5.793,5.707Z"></path></svg>,
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M9.405 1.05c-.413-1.4-2.397-1.4-2.81 0l-.1.34a1.464 1.464 0 0 1-2.105.872l-.31-.17c-1.283-.698-2.686.705-1.987 1.987l.169.311c.446.82.023 1.841-.872 2.105l-.34.1c-1.4.413-1.4 2.397 0 2.81l.34.1a1.464 1.464 0 0 1 .872 2.105l-.17.31c-.698 1.283.705 2.686 1.987 1.987l.311-.169a1.464 1.464 0 0 1 2.105.872l.1.34c.413 1.4 2.397 1.4 2.81 0l.1-.34a1.464 1.464 0 0 1 2.105-.872l.31.17c1.283.698 2.686-.705 1.987-1.987l-.169-.311a1.464 1.464 0 0 1 .872-2.105l.34-.1c1.4-.413 1.4-2.397 0-2.81l-.34-.1a1.464 1.464 0 0 1-.872-2.105l.17-.31c.698-1.283-.705-2.686-1.987-1.987l-.311.169a1.464 1.464 0 0 1-2.105-.872zM8 10.93a2.929 2.929 0 1 1 0-5.86 2.929 2.929 0 0 1 0 5.858z"></path></svg>,
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M7.835,16.17c-.23-.23-.446-.482-.641-.748-.325-.446-.227-1.072,.22-1.397,.446-.325,1.071-.227,1.397,.219,.129,.178,.274,.349,.437,.511,.803,.803,1.87,1.245,3.005,1.245s2.203-.442,3.005-1.245l5.5-5.5c1.657-1.657,1.657-4.354,0-6.011s-4.354-1.657-6.011,0l-1.058,1.058c-.391.391-1.023.391-1.414,0s-.391-1.023,0-1.414l1.058-1.058c2.437-2.438,6.402-2.438,8.839,0,2.437,2.437,2.437,6.402,0,8.839l-5.5,5.5c-1.18,1.181-2.75,1.831-4.419,1.831s-3.239-.65-4.418-1.83Z"></path></svg>,
  ];

  return null;
}
