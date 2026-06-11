import { useRef, useState, useEffect } from "react";
import html2canvas from "html2canvas";
import QRCode from "qrcode";
import { uploadCard, saveProfile } from "../supabase";
import { getProfile, problems, impacts } from "../profiles";
import HelixIcon from "../components/HelixIcon";

export default function DNACard({ photo, name, email, problem, impact, onReset }) {
  const profile = getProfile(problem, impact);
  const cardRef = useRef(null);
  const qrRef = useRef(null);
  
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState("saving"); // saving | saved | error
  const [shareUrl, setShareUrl] = useState("");
  const [copied, setCopied] = useState(false);

  const problemLabel = problems.find(p => p.id === problem)?.label;
  const impactLabel  = impacts.find(i => i.id === impact)?.label;
  const problemIcon  = problems.find(p => p.id === problem)?.icon;

  const colorMap = {
    revenue: { main: "#00d2ff", bg: "rgba(0,210,255,0.07)",  border: "rgba(0,210,255,0.25)"  },
    cost:    { main: "#0088ff", bg: "rgba(0,136,255,0.07)",  border: "rgba(0,136,255,0.25)"  },
    time:    { main: "#818cf8", bg: "rgba(129,140,248,0.07)",  border: "rgba(129,140,248,0.25)"  },
  };
  const c = colorMap[impact];

  useEffect(() => {
    // Wait a brief moment for the card layout animation to render in the DOM, then auto-save
    const timer = setTimeout(() => {
      autoSaveToCloud();
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  async function renderCanvas() {
    return html2canvas(cardRef.current, {
      backgroundColor: "#060910",
      scale: 2,
      useCORS: true,
      allowTaint: true,
      logging: false,
    });
  }

  async function autoSaveToCloud() {
    setSaveStatus("saving");
    try {
      // 1. Render card image to canvas
      const canvas = await renderCanvas();
      const cardDataUrl = canvas.toDataURL("image/png");

      // 2. Upload card image to storage
      const slug = email.replace(/[^a-z0-9]/gi, "_").toLowerCase();
      const ts = Date.now();
      const filename = `${slug}_card_${ts}.png`;
      const cardUrl = await uploadCard(cardDataUrl, filename);

      // 3. Upload selfie photo to storage (if present)
      let photoUrl = null;
      if (photo) {
        const photoFilename = `${slug}_photo_${ts}.jpg`;
        photoUrl = await uploadCard(photo, photoFilename);
      }

      // 4. Save profile to DB
      const row = await saveProfile({
        name,
        email,
        problem_id: problem,
        impact_id: impact,
        profile_key: `${problem}-${impact}`,
        card_url: cardUrl,
        photo_url: photoUrl,
      });

      // 5. Generate QR Code URL
      const url = `${window.location.origin}/profile/${row.id}`;
      setShareUrl(url);
      setSaveStatus("saved");

      // Render the QR code in the canvas
      setTimeout(() => renderQR(url), 50);
    } catch (err) {
      console.error("Auto-save failed:", err);
      setSaveStatus("error");
    }
  }

  async function renderQR(url) {
    if (!qrRef.current) return;
    try {
      await QRCode.toCanvas(qrRef.current, url, {
        width: 130,
        margin: 1,
        color: { dark: c.main, light: "#081125" },
        errorCorrectionLevel: "M",
      });
    } catch (err) {
      console.error("QR error:", err);
    }
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

  async function copyLink() {
    await navigator.clipboard?.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="screen">
      {saving && (
        <div className="saving-overlay">
          GENERATING IMAGE...
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

            <div className="dna-id">AI·DNA — PROFILE #{profile.id} / 24</div>
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

        {/* ── Auto-save Status & Share Tools ── */}
        {saveStatus === "saving" && (
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
            padding: "16px", background: "rgba(0, 136, 255, 0.05)", border: `1.5px dashed ${c.border}`,
            borderRadius: 12, marginTop: 16, color: "var(--text-secondary)", fontSize: 13,
            fontFamily: "var(--font-mono)", animation: "fadeIn 0.3s ease"
          }}>
            <span className="save-dot" style={{ display: "inline-block", width: 8, height: 8, borderRadius: "50%", background: c.main }} />
            Saving to cloud...
          </div>
        )}

        {saveStatus === "saved" && (
          <div style={{
            marginTop: 20, padding: 16, background: "rgba(8, 17, 37, 0.4)",
            border: `1.5px solid ${c.border}`, borderRadius: 12,
            display: "flex", alignItems: "center", gap: 16,
            animation: "fadeIn 0.3s ease"
          }}>
            <div style={{ flexShrink: 0, background: "#081125", padding: 4, borderRadius: 8, border: `1px solid ${c.border}` }}>
              <canvas ref={qrRef} style={{ display: "block", borderRadius: 4 }} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <h4 style={{ fontSize: 13, fontWeight: 700, color: c.main, marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Scan to Share
              </h4>
              <p style={{ fontSize: 11, color: "var(--text-secondary)", marginBottom: 12, lineHeight: 1.4 }}>
                Scan with any phone to view this card online and share it.
              </p>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={copyLink} className="btn btn-ghost" style={{ padding: "8px 12px", fontSize: 11, flex: 1 }}>
                  {copied ? "Copied! ✓" : "Copy link"}
                </button>
                <a href={shareUrl} target="_blank" rel="noopener noreferrer" className="btn btn-ghost" style={{ padding: "8px 12px", fontSize: 11, textDecoration: "none", color: "var(--text-primary)" }}>
                  ↗ Open
                </a>
              </div>
            </div>
          </div>
        )}

        {saveStatus === "error" && (
          <div style={{
            marginTop: 16, padding: "16px", background: "rgba(239, 68, 68, 0.08)",
            border: "1.5px solid rgba(239, 68, 68, 0.25)", borderRadius: 12,
            display: "flex", flexDirection: "column", gap: 10, animation: "fadeIn 0.3s ease"
          }}>
            <div style={{ fontSize: 12, color: "#fca5a5", lineHeight: 1.5 }}>
              ⚠️ **Cloud save failed.** We couldn't upload your card.
            </div>
            <button onClick={autoSaveToCloud} className="btn btn-primary" style={{ padding: "10px 16px", fontSize: 12, background: "linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)", boxShadow: "0 0 12px rgba(239,68,68,0.2)", color: "#fff" }}>
              🔄 Retry saving
            </button>
          </div>
        )}

        {/* Local download button */}
        <button
          className="btn btn-ghost"
          style={{ width: "100%", marginTop: 16 }}
          onClick={handleSave}
          disabled={saving}
        >
          ↓ Download image locally
        </button>

        {/* Reset/another profile button */}
        <button 
          className="btn btn-ghost" 
          style={{ 
            width: "100%", marginTop: 10, fontSize: 12,
            opacity: saveStatus === "saving" ? 0.3 : 1,
            cursor: saveStatus === "saving" ? "not-allowed" : "pointer" 
          }} 
          onClick={saveStatus === "saving" ? null : onReset}
          disabled={saveStatus === "saving"}
        >
          Profile another participant →
        </button>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .save-dot {
          animation: pulse-dot 1.2s infinite ease-in-out;
        }
        @keyframes pulse-dot {
          0%, 100% { opacity: 0.4; transform: scale(0.9); }
          50% { opacity: 1; transform: scale(1.1); }
        }
      `}</style>
    </div>
  );
}
