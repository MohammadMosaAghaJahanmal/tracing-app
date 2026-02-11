import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../services/api";
import { AdminAuthContext } from "../../contexts/AdminAuthContext";

export default function Login() {
  const { login } = useContext(AdminAuthContext);
  const nav = useNavigate();
  const [email, setEmail] = useState("admin@example.com");
  const [password, setPassword] = useState("Admin@123");
  const [msg, setMsg] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setMsg("Logging in...");
    try {
      const res = await api.post("/admin/login", { email, password });
      login(res.data.token);
      nav("/admin/dashboard");
    } catch (err) {
      setMsg(err?.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="pageCenter">
      <form className="card auth" onSubmit={submit}>
        <div className="authTitle">Admin Login</div>
        <label className="label">Email</label>
        <input className="input" value={email} onChange={(e) => setEmail(e.target.value)} />

        <label className="label">Password</label>
        <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />

        <button className="btn primary" type="submit">Login</button>
        <div className="hint">{msg}</div>

        <div className="muted small">
          Default: <b>admin@example.com</b> / <b>Admin@123</b>
        </div>
      </form>
    </div>
  );
}
