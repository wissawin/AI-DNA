import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import { uploadCard, saveProfile } from "../supabase";
import { getProfile } from "../profiles";
import HelixIcon from "../components/HelixIcon";

export default function StepShare({ cardDataUrl, photo, name, email, problem, impact, profileName, color, onReset }) {
  const qrRef = useRef(null);
  const [phase, setPhase] = useState("uploading"); // uploading | ready | error
  const [shareUrl, setShareUrl] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (cardDataUrl) doUploadAndSave();
  }, []);

  async function doUploadAndSave() {
    setPhase("uploading");
    try {
      // 1. Upload card image
      const slug = email.replace(/[^a-z0-9]/gi, "_").toLowerCase();
      const ts = Date.now();
      const filename = `${slug}_${ts}.png`;
      const cardUrl = await uploadCard(cardDataUrl, filename);

      // 1.5 Upload selfie photo if present
      let photoUrl = null;
      if (photo) {
        const photoFilename = `${slug}_photo_${ts}.jpg`;
        photoUrl = await uploadCard(photo, photoFilename);
      }

      // 2. Save profile metadata to DB
      const profile = getProfile(problem, impact);
      const row = await saveProfile({
        name,
        email,
        problem_id: problem,
        impact_id: impact,
        profile_key: `${problem}-${impact}`,
        card_url: cardUrl,
        photo_url: photoUrl,
      });

      // 3. Build shareable URL → /profile/<uuid>
      const url = `${window.location.origin}/profile/${row.id}`;
      setShareUrl(url);
      setPhase("ready");

      // Render QR after URL is set
      setTimeout(() => renderQR(url), 50);
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || "Upload failed.");
      setPhase("error");
    }
  }

  async function renderQR(url) {
    if (!qrRef.current) return;
    try {
      await QRCode.toCanvas(qrRef.current, url, {
        width: 220,
        margin: 2,
        color: { dark: color, light: "#060910" },
        errorCorrectionLevel: "M",
      });
    } catch (err) {
      console.error("QR error:", err);
    }
  }

  async function copyLink() {
    await navigator.clipboard?.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const colorMap = {
    "#4ADE80": { border: "rgba(74,222,128,0.3)",  glow: "rgba(74,222,128,0.15)" },
    "#60A5FA": { border: "rgba(96,165,250,0.3)",  glow: "rgba(96,165,250,0.15)" },
    "#FBBF24": { border: "rgba(251,191,36,0.3)",  glow: "rgba(251,191,36,0.15)"  },
  };
  const c = colorMap[color] ?? colorMap["#4ADE80"];

  return (
    <div className="screen">
      <div className="card">
        <div className="logo-mark">
          <HelixIcon />
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--text-muted)", letterSpacing: "0.1em" }}>AI·DNA</span>
        </div>

        {/* ── Uploading ── */}
        {phase === "uploading" && (
          <div style={{ textAlign: "center", padding: "32px 0" }}>
            <div style={{ fontSize: 48, marginBottom: 16, animation: "spin 1.2s linear infinite" }}>⚡</div>
            <h2 className="h2" style={{ marginBottom: 8 }}>Saving to cloud...</h2>
            <p style={{ color: "var(--text-muted)", fontSize: 14 }}>Uploading your AI-DNA card</p>
          </div>
        )}

        {/* ── Ready: show QR ── */}
        {phase === "ready" && (
          <>
            <p className="eyebrow">Card saved ✓</p>
            <h2 className="h2" style={{ marginBottom: 6 }}>
              {name ? `${name}'s` : "Your"} AI-DNA card<br />
              <span style={{ color }}>is live!</span>
            </h2>
            <p style={{ color: "var(--text-secondary)", fontSize: 14, marginBottom: 24 }}>
              Scan the QR code with any phone to view {name ? `${name}'s` : "the"} profile card — no app needed.
            </p>

            {/* QR frame */}
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
              <div style={{
                padding: 16, borderRadius: 16,
                border: `1px solid ${c.border}`,
                background: c.glow,
                boxShadow: `0 0 28px ${c.glow}`,
                display: "inline-block",
              }}>
                <canvas
                  ref={qrRef}
                  style={{ display: "block", borderRadius: 8 }}
                />
              </div>
            </div>

            {/* Profile type badge */}
            {profileName && (
              <div style={{
                textAlign: "center", marginBottom: 16,
                fontFamily: "var(--font-mono)", fontSize: 11,
                color, letterSpacing: "0.1em", opacity: 0.8,
              }}>
                ◆ {profileName}
              </div>
            )}

            {/* URL copy row */}
            <div style={{
              background: "var(--bg3)", border: "1px solid var(--border)",
              borderRadius: 8, padding: "10px 14px",
              marginBottom: 16,
              display: "flex", alignItems: "center", gap: 8,
            }}>
              <span style={{
                fontFamily: "var(--font-mono)", fontSize: 11,
                color: "var(--text-muted)", flex: 1,
                overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
              }}>
                {shareUrl}
              </span>
              <button
                onClick={copyLink}
                style={{
                  background: "none", border: "none", cursor: "pointer",
                  color: copied ? color : "var(--text-muted)",
                  fontSize: 14, padding: "2px 4px", flexShrink: 0,
                  transition: "color 0.2s",
                }}
                title="Copy link"
              >
                {copied ? "✓" : "📋"}
              </button>
            </div>

            <a
              href={shareUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
              style={{ display: "flex", textDecoration: "none", marginBottom: 10, background: color, color: "#000", fontWeight: 700 }}
            >
              ↗ Open profile page
            </a>
          </>
        )}

        {/* ── Error ── */}
        {phase === "error" && (
          <>
            <div style={{
              background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)",
              borderRadius: 10, padding: "16px 20px", marginBottom: 20,
              color: "#fca5a5", fontSize: 14, lineHeight: 1.6,
            }}>
              <strong>Upload failed.</strong><br />
              {errorMsg}<br /><br />
              Make sure the <strong>dna-cards</strong> bucket exists in Supabase with public access, and the <strong>profiles</strong> table has been created.
            </div>
            <button className="btn btn-primary" onClick={doUploadAndSave} style={{ marginBottom: 10 }}>
              🔄 Retry
            </button>
          </>
        )}

        <button className="btn btn-ghost" style={{ width: "100%" }} onClick={onReset}>
          Profile another participant →
        </button>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
