import { useState } from "react";
import { impacts, problems } from "../profiles";
import HelixIcon from "../components/HelixIcon";

export default function StepImpact({ problem, onSelect, onBack }) {
  const [selected, setSelected] = useState(null);

  const problemLabel = problems.find(p => p.id === problem)?.label;

  const impactConfig = {
    revenue: { color: "var(--green)", glow: "var(--green-glow)", dot: "#4ADE80", desc: "You're wired to build new streams of value" },
    cost:    { color: "var(--blue)",  glow: "var(--blue-glow)",  dot: "#60A5FA", desc: "You're wired to protect and maximise margin" },
    time:    { color: "var(--amber)", glow: "var(--amber-glow)", dot: "#FBBF24", desc: "You're wired to compress effort and cycle time" },
  };

  return (
    <div className="screen">
      <div className="card">
        <div className="logo-mark">
          <HelixIcon />
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--text-muted)", letterSpacing: "0.1em" }}>AI·DNA</span>
        </div>

        <div className="steps">
          <div className="step-dot done" />
          <div className="step-line" style={{ background: "var(--green)", opacity: 0.4 }} />
          <div className="step-dot active" />
        </div>

        <p className="eyebrow">Question 2 of 2</p>
        <h2 className="h2">
          What business impact<br />
          <span style={{ color: "var(--green)" }}>matters most to you?</span>
        </h2>

        <div style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          background: "var(--bg3)",
          border: "1px solid var(--border)",
          borderRadius: 8,
          padding: "8px 14px",
          marginBottom: 24,
          fontSize: 13,
          color: "var(--text-secondary)"
        }}>
          <span style={{ fontSize: 16 }}>{problems.find(p => p.id === problem)?.icon}</span>
          {problemLabel}
          <span style={{ color: "var(--green)", fontWeight: 600, marginLeft: 4 }}>✓</span>
        </div>

        <div className="choice-grid" style={{ gridTemplateColumns: "1fr", gap: 12, marginBottom: 28 }}>
          {impacts.map(impact => {
            const cfg = impactConfig[impact.id];
            const isSelected = selected === impact.id;
            return (
              <button
                key={impact.id}
                className="impact-btn"
                style={{
                  "--i-color": cfg.color,
                  "--i-glow": cfg.glow,
                  borderColor: isSelected ? cfg.color : "var(--border)",
                  background: isSelected ? cfg.glow : "var(--bg3)",
                }}
                onClick={() => setSelected(impact.id)}
              >
                <div className="impact-dot" style={{ background: cfg.dot }} />
                <div className="i-label">{impact.label}</div>
                <div className="i-sub">{cfg.desc}</div>
              </button>
            );
          })}
        </div>

        <button
          className="btn btn-primary"
          disabled={!selected}
          onClick={() => onSelect(selected)}
          style={{ marginBottom: 12 }}
        >
          Reveal my AI-DNA →
        </button>
        <button className="btn btn-ghost" style={{ width: "100%" }} onClick={onBack}>
          ← Back
        </button>
      </div>
    </div>
  );
}
