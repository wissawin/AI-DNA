import { useState } from "react";
import StepCamera from "./screens/StepCamera";
import Welcome from "./screens/Welcome";
import StepProblem from "./screens/StepProblem";
import StepImpact from "./screens/StepImpact";
import DNACard from "./screens/DNACard";
import StepShare from "./screens/StepShare";
import ProfilePage from "./screens/ProfilePage";
import { getProfile } from "./profiles";
import "./App.css";

// ── Simple client-side routing for /profile/:id ──────────────────────────────
const pathParts = window.location.pathname.split("/").filter(Boolean);
const isProfilePage = pathParts[0] === "profile" && pathParts[1];

export default function App() {
  const [screen, setScreen] = useState("camera"); // camera | welcome | problem | impact | card | share
  const [photo, setPhoto] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [problem, setProblem] = useState(null);
  const [impact, setImpact] = useState(null);
  const [sharePayload, setSharePayload] = useState(null); // { cardDataUrl, profileId }

  function reset() {
    setScreen("camera");
    setPhoto(null);
    setName("");
    setEmail("");
    setProblem(null);
    setImpact(null);
    setSharePayload(null);
  }

  const profile = problem && impact ? getProfile(problem, impact) : null;
  const colorMap = { revenue: "#4ADE80", cost: "#60A5FA", time: "#FBBF24" };

  // ── Render shareable profile page ──────────────────────────────────────────
  if (isProfilePage) {
    return (
      <div className="app-root">
        <div className="dna-bg" aria-hidden="true">
          {Array.from({ length: 18 }).map((_, i) => (
            <div key={i} className="dna-strand" style={{ left: `${(i / 18) * 100}%`, animationDelay: `${i * 0.4}s` }} />
          ))}
        </div>
        <ProfilePage profileId={pathParts[1]} />
      </div>
    );
  }

  return (
    <div className="app-root">
      <div className="dna-bg" aria-hidden="true">
        {Array.from({ length: 18 }).map((_, i) => (
          <div key={i} className="dna-strand" style={{ left: `${(i / 18) * 100}%`, animationDelay: `${i * 0.4}s` }} />
        ))}
      </div>

      {screen === "camera" && (
        <StepCamera onCapture={(p) => { setPhoto(p); setScreen("welcome"); }} />
      )}
      {screen === "welcome" && (
        <Welcome onStart={({ name: n, email: e }) => { setName(n); setEmail(e); setScreen("problem"); }} />
      )}
      {screen === "problem" && (
        <StepProblem onSelect={(p) => { setProblem(p); setScreen("impact"); }} />
      )}
      {screen === "impact" && (
        <StepImpact problem={problem} onSelect={(i) => { setImpact(i); setScreen("card"); }} onBack={() => setScreen("problem")} />
      )}
      {screen === "card" && (
        <DNACard
          photo={photo} name={name} email={email} problem={problem} impact={impact}
          onReset={reset}
          onShare={(payload) => { setSharePayload(payload); setScreen("share"); }}
        />
      )}
      {screen === "share" && (
        <StepShare
          cardDataUrl={sharePayload?.cardDataUrl}
          photo={photo}
          name={name}
          email={email}
          problem={problem}
          impact={impact}
          profileName={profile?.name}
          color={colorMap[impact]}
          onReset={reset}
        />
      )}
    </div>
  );
}
