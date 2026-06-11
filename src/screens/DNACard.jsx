import { useRef, useState } from "react";
import html2canvas from "html2canvas";
import { getProfile, problems, impacts } from "../profiles";
import HelixIcon from "../components/HelixIcon";

export default function DNACard({ photo, name, email, problem, impact, onReset, onShare }) {
  const profile = getProfile(problem, impact);
  const cardRef = useRef(null);
  const [saving, setSaving] = useState(false);
  const [sharing, setSharing] = useState(false);

  const problemLabel = problems.find(p => p.id === problem)?.label;
  const impactLabel  = impacts.find(i => i.id === impact)?.label;
  const problemIcon  = problems.find(p => p.id === problem)?.icon;

  const colorMap = {
    revenue: { main: "#4ADE80", bg: "rgba(74,222,128,0.07)",  border: "rgba(74,222,128,0.25)"  },
    cost:    { main: "#60A5FA", bg: "rgba(96,165,250,0.07)",  border: "rgba(96,165,250,0.25)"  },
    time:    { main: "#FBBF24", bg: "rgba(251,191,36,0.07)",  border: "rgba(251,191,36,0.25)"  },
  };
  const c = colorMap[impact];

  async function renderCanvas() {
    return html2canvas(cardRef.current, {
      backgroundColor: "#060910",
      scale: 2,
      useCORS: true,
      allowTaint: true,
      logging: false,
    });
  }

  async function handleSave() {
    setSaving(true);
    try {
      const canvas = await renderCanvas();
      const link = document.createElement("a");
      link.download = `AI-DNA_${profile.name.replace(/\s+/g, "_")}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (err) {
      console.error(err);
      alert("Could not save image. Try a screenshot instead.");
    }
    setSaving(false);
  }

  async function handleShare() {
    setSharing(true);
    try {
      const canvas = await renderCanvas();
      const cardDataUrl = canvas.toDataURL("image/png");
      onShare({ cardDataUrl });
    } catch (err) {
      console.error(err);
      alert("Could not generate card image.");
      setSharing(false);
    }
  }

  return (
    <div className="screen">
      {(saving || sharing) && (
        <div className="saving-overlay">
          {sharing ? "PREPARING CARD..." : "GENERATING IMAGE..."}
        </div>
      )}

      <div className="card">
        <div className="logo-mark">
          <HelixIcon />
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--text-muted)", letterSpacing: "0.1em" }}>AI·DNA</span>
        </div>

        <p style={{ fontSize: 14, color: "var(--text-secondary)", marginBottom: 16 }}>
          Your AI-DNA profile is ready.
        </p>

        {/* ── Saveable card ─────────────────────────────────────── */}
        <div ref={cardRef}>
          <div
            className="dna-card-inner card-reveal"
            style={{ "--card-color": c.main, background: c.bg, borderColor: c.border }}
          >
            {/* DNA watermark */}
            <div style={{
              position: "absolute", top: 16, right: 20,
              fontFamily: "var(--font-mono)", fontSize: 10, color: c.main,
              opacity: 0.1, letterSpacing: "0.2em", lineHeight: 1.8,
              pointerEvents: "none", userSelect: "none",
            }}>
              {["ATCG GCTA","CGAT TAGC","GCAT ATGC","TAGC CGAT","ATCG GCTA","CGAT TAGC"].map((s, i) => (
                <div key={i}>{s}</div>
              ))}
            </div>

            {/* Top row: photo + profile icon */}
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 18 }}>
              <div style={{
                width: 72, height: 72, borderRadius: "50%", flexShrink: 0,
                overflow: "hidden",
                border: `2px solid ${c.main}66`,
                boxShadow: `0 0 14px ${c.main}44`,
                background: "var(--bg3)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                {photo
                  ? <img src={photo} alt="Profile" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  : <span style={{ fontSize: 32 }}>👤</span>
                }
              </div>
              <div style={{
                fontSize: 52, lineHeight: 1,
                filter: `drop-shadow(0 0 14px ${c.main}88)`,
                userSelect: "none",
              }}>
                {profile.icon}
              </div>
            </div>

            <div className="dna-id">AI·DNA — PROFILE #{profile.id} / 21</div>
            <div className="dna-name">{profile.name}</div>
            <div className="dna-tagline">"{profile.tagline}"</div>
            <div className="dna-desc">{profile.description}</div>

            <div className="dna-meta">
              <span className="dna-pill" style={{ color: c.main, borderColor: c.border }}>
                {problemIcon} {problemLabel}
              </span>
              <span className="dna-pill" style={{ color: c.main, borderColor: c.border }}>
                ◆ {impactLabel}
              </span>
            </div>

            <div className="dna-owner">
              <div className="dna-owner-info">
                {name && <div className="owner-name">{name}</div>}
                <div className="owner-email">{email}</div>
              </div>
              <div className="dna-badge">CBM AI TEAM<br />AI CHAMPION</div>
            </div>
          </div>
        </div>
        {/* ── End saveable card ─────────────────────────────────── */}

        {/* Primary: Save to cloud + QR */}
        <button
          className="btn btn-primary"
          style={{ width: "100%", marginTop: 16, background: c.main, color: "#000", fontWeight: 700 }}
          onClick={handleShare}
          disabled={sharing}
        >
          ☁️ Save to cloud &amp; get QR code
        </button>

        {/* Secondary: local download */}
        <button
          className="btn btn-ghost"
          style={{ width: "100%", marginTop: 10 }}
          onClick={handleSave}
          disabled={saving}
        >
          ↓ Download image locally
        </button>

        <button className="btn btn-ghost" style={{ width: "100%", marginTop: 10, fontSize: 12 }} onClick={onReset}>
          Profile another participant →
        </button>
      </div>
    </div>
  );
}
