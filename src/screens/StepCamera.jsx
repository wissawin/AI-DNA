import { useRef, useState, useEffect } from "react";
import HelixIcon from "../components/HelixIcon";

export default function StepCamera({ onCapture }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const [phase, setPhase] = useState("init"); // init | preview | countdown | captured
  const [photo, setPhoto] = useState(null);
  const [count, setCount] = useState(3);
  const [error, setError] = useState(null);

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  async function startCamera() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 640 }, height: { ideal: 640 } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setPhase("preview");
    } catch (err) {
      setError("Camera not available. Please allow camera access and try again.");
    }
  }

  function stopCamera() {
    streamRef.current?.getTracks().forEach(t => t.stop());
  }

  function startCountdown() {
    setPhase("countdown");
    setCount(3);
    let c = 3;
    const interval = setInterval(() => {
      c -= 1;
      setCount(c);
      if (c === 0) {
        clearInterval(interval);
        takePhoto();
      }
    }, 1000);
  }

  function takePhoto() {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const size = Math.min(video.videoWidth, video.videoHeight);
    const offsetX = (video.videoWidth - size) / 2;
    const offsetY = (video.videoHeight - size) / 2;
    canvas.width = 400;
    canvas.height = 400;
    const ctx = canvas.getContext("2d");
    
    // Enhance portrait brightness and saturation to fit the neon cyber-theme in downloads
    ctx.filter = "brightness(1.2) saturate(1.3)";
    
    // mirror the image (selfie feel)
    ctx.translate(400, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, offsetX, offsetY, size, size, 0, 0, 400, 400);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
    setPhoto(dataUrl);
    setPhase("captured");
    stopCamera();
  }

  function retake() {
    setPhoto(null);
    setPhase("init");
    startCamera();
  }

  function confirm() {
    onCapture(photo);
  }

  function skip() {
    stopCamera();
    onCapture(null);
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

        <p className="eyebrow">Step 1 of 3</p>
        <h2 className="h2">
          {phase === "captured" ? "Looking good! 👍" : (
            <>Say hello to your<br /><span style={{ color: "var(--green)" }}>AI-DNA card</span></>
          )}
        </h2>
        <p className="subtitle" style={{ marginBottom: 20 }}>
          {phase === "captured"
            ? "Your photo will appear on your profile card."
            : "Take a quick selfie — it'll appear on your DNA card."}
        </p>

        {/* Error state */}
        {error && (
          <div style={{
            background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)",
            borderRadius: 10, padding: "16px 20px", marginBottom: 20,
            color: "#fca5a5", fontSize: 14, lineHeight: 1.5,
          }}>
            {error}
          </div>
        )}

        {/* Camera / photo area */}
        <div style={{ position: "relative", marginBottom: 20 }}>
          {/* Circular frame */}
          <div style={{
            width: 240, height: 240, borderRadius: "50%",
            margin: "0 auto",
            overflow: "hidden",
            border: `3px solid ${phase === "captured" ? "var(--green)" : "var(--border)"}`,
            boxShadow: phase === "captured" ? "0 0 24px rgba(74,222,128,0.3)" : "none",
            background: "var(--bg3)",
            position: "relative",
            transition: "border-color 0.3s, box-shadow 0.3s",
          }}>
            {/* Live video */}
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              style={{
                width: "100%", height: "100%",
                objectFit: "cover",
                transform: "scaleX(-1)", // mirror
                display: phase === "captured" ? "none" : "block",
              }}
            />
            {/* Captured photo */}
            {photo && (
              <img src={photo} alt="Your photo" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            )}
            {/* Placeholder when error */}
            {error && !photo && (
              <div style={{
                width: "100%", height: "100%", display: "flex",
                alignItems: "center", justifyContent: "center",
                fontSize: 64,
              }}>📷</div>
            )}
          </div>

          {/* Countdown overlay */}
          {phase === "countdown" && (
            <div style={{
              position: "absolute", inset: 0,
              display: "flex", alignItems: "center", justifyContent: "center",
              pointerEvents: "none",
            }}>
              <div style={{
                width: 80, height: 80, borderRadius: "50%",
                background: "rgba(6,9,16,0.7)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 40, fontWeight: 700, color: "var(--green)",
                fontFamily: "var(--font-mono)",
                animation: "pulse 1s ease-in-out infinite",
              }}>
                {count}
              </div>
            </div>
          )}
        </div>

        {/* Hidden canvas for snapshot */}
        <canvas ref={canvasRef} style={{ display: "none" }} />

        {/* Actions */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {phase === "preview" && (
            <button className="btn btn-primary" onClick={startCountdown}>
              📸 Take photo
            </button>
          )}
          {phase === "countdown" && (
            <button className="btn btn-primary" disabled style={{ opacity: 0.5 }}>
              Get ready...
            </button>
          )}
          {phase === "captured" && (
            <>
              <button className="btn btn-primary" onClick={confirm}>
                Use this photo →
              </button>
              <button className="btn btn-ghost" onClick={retake}>
                🔄 Retake
              </button>
            </>
          )}
          {phase === "init" && !error && (
            <button className="btn btn-primary" disabled style={{ opacity: 0.5 }}>
              Starting camera...
            </button>
          )}
        </div>

        <button
          onClick={skip}
          style={{
            marginTop: 16, background: "none", border: "none",
            color: "var(--text-muted)", fontSize: 12, cursor: "pointer",
            fontFamily: "var(--font-display)", textDecoration: "underline",
            width: "100%",
          }}
        >
          Skip photo
        </button>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.08); }
        }
      `}</style>
    </div>
  );
}
