import { useState } from "react";
import HelixIcon from "../components/HelixIcon";

export default function Welcome({ onStart }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const valid = name.trim().length > 0 && email.includes("@");

  function handleSubmit(e) {
    e.preventDefault();
    if (valid) onStart({ name: name.trim(), email: email.trim() });
  }

  return (
    <div className="screen">
      <div className="card">
        <div className="logo-mark">
          <HelixIcon />
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--text-muted)", letterSpacing: "0.1em" }}>
            AI·DNA
          </span>
        </div>

        <p className="eyebrow">Step 2 of 3</p>
        <h2 className="h2">
          Tell us who<br />
          <span style={{ color: "var(--green)" }}>you are</span>
        </h2>
        <p className="subtitle">
          Your name and email will appear on your AI-DNA card.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>Your name</label>
            <input
              type="text"
              placeholder="e.g. Somchai Preeda"
              value={name}
              onChange={e => setName(e.target.value)}
              autoComplete="off"
              autoFocus
            />
          </div>
          <div className="field" style={{ marginBottom: 28 }}>
            <label>Work email</label>
            <input
              type="email"
              placeholder="you@scg.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              autoComplete="off"
            />
          </div>
          <button className="btn btn-primary" type="submit" disabled={!valid}>
            Start profiling →
          </button>
        </form>

        <p style={{ marginTop: 20, fontSize: 12, color: "var(--text-muted)", textAlign: "center" }}>
          Your profile will be saved and shareable via QR code.
        </p>
      </div>
    </div>
  );
}
