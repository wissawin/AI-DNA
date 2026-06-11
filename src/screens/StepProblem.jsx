import { useState } from "react";
import { problems } from "../profiles";
import HelixIcon from "../components/HelixIcon";

export default function StepProblem({ onSelect }) {
  const [selected, setSelected] = useState(null);

  return (
    <div className="screen">
      <div className="card">
        <div className="logo-mark">
          <HelixIcon />
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--text-muted)", letterSpacing: "0.1em" }}>AI·DNA</span>
        </div>

        <div className="steps">
          <div className="step-dot active" />
          <div className="step-line" />
          <div className="step-dot" />
        </div>

        <p className="eyebrow">Question 1 of 2</p>
        <h2 className="h2">
          Where do you want<br />
          <span style={{ color: "var(--green)" }}>AI to solve problems?</span>
        </h2>
        <p className="subtitle">Pick the domain closest to your daily work.</p>

        <div className="choice-grid" style={{ gridTemplateColumns: "1fr" }}>
          {problems.map(p => (
            <button
              key={p.id}
              className={`choice-btn ${selected === p.id ? "selected" : ""}`}
              style={{
                "--selection-color": "var(--green)",
                "--selection-bg": "var(--green-glow)",
                "--selection-glow": "var(--green-glow)",
              }}
              onClick={() => setSelected(p.id)}
            >
              <span className="icon">{p.icon}</span>
              <span>{p.label}</span>
              {selected === p.id && (
                <span style={{ marginLeft: "auto", color: "var(--green)", fontSize: 18 }}>✓</span>
              )}
            </button>
          ))}
        </div>

        <button
          className="btn btn-primary"
          disabled={!selected}
          onClick={() => onSelect(selected)}
        >
          Next →
        </button>
      </div>
    </div>
  );
}
