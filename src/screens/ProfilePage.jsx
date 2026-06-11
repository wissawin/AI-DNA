import { useEffect, useState } from "react";
import { getProfileById } from "../supabase";
import { profiles, problems, impacts } from "../profiles";
import HelixIcon from "../components/HelixIcon";

export default function ProfilePage({ profileId }) {
  const [row, setRow] = useState(null);
  const [phase, setPhase] = useState("loading"); // loading | ready | error
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    load();
  }, [profileId]);

  async function load() {
    try {
      const data = await getProfileById(profileId);
      setRow(data);
      setPhase("ready");
    } catch (err) {
      setErrorMsg(err.message);
      setPhase("error");
    }
  }

  if (phase === "loading") {
    return (
      <div className="screen">
        <div className="card" style={{ textAlign: "center", padding: "60px 40px" }}>
          <div style={{ fontSize: 48, marginBottom: 20, animation: "spin 1.2s linear infinite" }}>⚡</div>
          <p style={{ color: "var(--text-muted)", fontFamily: "var(--font-mono)", fontSize: 12, letterSpacing: "0.1em" }}>
            LOADING PROFILE...
          </p>
        </div>
        <style>{`@keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }`}</style>
      </div>
    );
  }

  if (phase === "error") {
    return (
      <div className="screen">
        <div className="card">
          <div className="logo-mark">
            <HelixIcon />
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--text-muted)", letterSpacing: "0.1em" }}>AI·DNA</span>
          </div>
          <div style={{
            background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)",
            borderRadius: 10, padding: "16px 20px",
            color: "#fca5a5", fontSize: 14, lineHeight: 1.6,
          }}>
            <strong>Profile not found.</strong><br />
            {errorMsg}
          </div>
        </div>
      </div>
    );
  }

  const profile = profiles[row.profile_key];
  const problem = problems.find(p => p.id === row.problem_id);
  const impact  = impacts.find(i => i.id === row.impact_id);

  if (!profile) {
    return (
      <div className="screen">
        <div className="card" style={{ textAlign: "center" }}>
          <p style={{ color: "var(--text-muted)" }}>Unknown profile type.</p>
        </div>
      </div>
    );
  }

  const colorMap = {
    revenue: { main: "#4ADE80", bg: "rgba(74,222,128,0.07)", border: "rgba(74,222,128,0.25)", glow: "rgba(74,222,128,0.15)" },
    cost:    { main: "#60A5FA", bg: "rgba(96,165,250,0.07)", border: "rgba(96,165,250,0.25)", glow: "rgba(96,165,250,0.15)" },
    time:    { main: "#FBBF24", bg: "rgba(251,191,36,0.07)", border: "rgba(251,191,36,0.25)", glow: "rgba(251,191,36,0.15)" },
  };
  const c = colorMap[row.impact_id] ?? colorMap.revenue;

  const joinedAt = new Date(row.created_at).toLocaleDateString("en-US", {
    day: "numeric", month: "short", year: "numeric",
  });

  return (
    <div className="screen" style={{ maxWidth: 520 }}>
      {/* ── Header ── */}
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <div className="logo-mark" style={{ justifyContent: "center" }}>
          <HelixIcon />
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--text-muted)", letterSpacing: "0.1em" }}>AI·DNA</span>
        </div>
        <p style={{ fontSize: 12, color: "var(--text-muted)", fontFamily: "var(--font-mono)", letterSpacing: "0.08em", marginTop: 4 }}>
          CBM AI TEAM · AI CHAMPION PROFILE
        </p>
      </div>

      {/* ── Card ── */}
      <div
        className="dna-card-inner"
        style={{
          "--card-color": c.main,
          background: c.bg,
          borderColor: c.border,
          boxShadow: `0 0 60px ${c.glow}`,
          marginBottom: 20,
          animation: "cardReveal 0.5s cubic-bezier(0.34,1.56,0.64,1)",
        }}
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

        {/* Photo + icon row */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 18 }}>
          <div style={{
            width: 80, height: 80, borderRadius: "50%", flexShrink: 0,
            overflow: "hidden",
            border: `2px solid ${c.main}66`,
            boxShadow: `0 0 20px ${c.main}44`,
            background: "var(--bg3)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            {row.photo_url
              ? <img src={row.photo_url} alt={row.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              : <span style={{ fontSize: 36 }}>👤</span>
            }
          </div>
          <div>
            <div style={{ fontSize: 58, lineHeight: 1, filter: `drop-shadow(0 0 16px ${c.main}88)`, userSelect: "none" }}>
              {profile.icon}
            </div>
          </div>
        </div>

        <div className="dna-id">AI·DNA — PROFILE #{profile.id} / 21</div>
        <div className="dna-name">{profile.name}</div>
        <div className="dna-tagline">"{profile.tagline}"</div>
        <div className="dna-desc">{profile.description}</div>

        <div className="dna-meta">
          {problem && (
            <span className="dna-pill" style={{ color: c.main, borderColor: c.border }}>
              {problem.icon} {problem.label}
            </span>
          )}
          {impact && (
            <span className="dna-pill" style={{ color: c.main, borderColor: c.border }}>
              ◆ {impact.label}
            </span>
          )}
        </div>

        <div className="dna-owner">
          <div className="dna-owner-info">
            {row.name && <div className="owner-name">{row.name}</div>}
            <div className="owner-email">{row.email}</div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-muted)", marginTop: 4 }}>
              Joined {joinedAt}
            </div>
          </div>
          <div className="dna-badge">CBM AI TEAM<br />AI CHAMPION</div>
        </div>
      </div>

      {/* ── Download card image ── */}
      <a
        href={row.card_url}
        target="_blank"
        rel="noopener noreferrer"
        download
        className="btn btn-primary"
        style={{
          display: "flex", textDecoration: "none", marginBottom: 12,
          background: c.main, color: "#000", fontWeight: 700,
          justifyContent: "center",
        }}
      >
        ↓ Download card image
      </a>

      {/* ── Create own profile ── */}
      <a
        href="/"
        className="btn btn-ghost"
        style={{ display: "flex", textDecoration: "none", justifyContent: "center", fontSize: 13 }}
      >
        ✦ Discover your own AI-DNA →
      </a>

      <p style={{ textAlign: "center", fontSize: 11, color: "var(--text-muted)", marginTop: 20, fontFamily: "var(--font-mono)", letterSpacing: "0.05em" }}>
        AI SQUAD SHOWDOWN 3 · CBM AI TEAM
      </p>

      <style>{`
        @keyframes cardReveal {
          0%  { opacity: 0; transform: scale(0.95) translateY(20px); }
          to  { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
}
