import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as api from "../api";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      // 1. Login and get token
      const res = await api.loginUser({ email, password });
      const { access_token } = res;
      api.setAuthToken(access_token); // set token for future requests
      // 2. Fetch user info with token
      const userRes = await api.getProfile();
      localStorage.setItem("shecare_user", JSON.stringify(userRes.data));
      setLoading(false);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.detail || "Login failed.");
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, #ffe0ec 0%, #f8f9fa 100%)" }}>
      <form onSubmit={handleSubmit} style={{ background: "#fff", padding: 36, borderRadius: 18, boxShadow: "0 4px 24px rgba(0,0,0,0.08)", minWidth: 340 }}>
        <h2 style={{ color: "#d72660", marginBottom: 24 }}>Login to SheCare AI</h2>
        {error && <div style={{ color: "#d72660", marginBottom: 12 }}>{error}</div>}
        <div style={{ marginBottom: 18 }}>
          <label style={{ display: "block", marginBottom: 6, color: "#555" }}>Email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} style={{ width: "100%", padding: 10, borderRadius: 6, border: "1px solid #ccc" }} disabled={loading} />
        </div>
        <div style={{ marginBottom: 18 }}>
          <label style={{ display: "block", marginBottom: 6, color: "#555" }}>Password</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} style={{ width: "100%", padding: 10, borderRadius: 6, border: "1px solid #ccc" }} disabled={loading} />
        </div>
        <button type="submit" style={{ width: "100%", background: "#d72660", color: "#fff", border: "none", borderRadius: 6, padding: 12, fontSize: 16, cursor: "pointer", marginBottom: 12 }} disabled={loading}>{loading ? "Logging in..." : "Login"}</button>
        <div style={{ textAlign: "center", color: "#555" }}>
          Don't have an account? <Link to="/signup" style={{ color: "#d72660" }}>Sign up</Link>
        </div>
      </form>
    </div>
  );
};

export default Login;
