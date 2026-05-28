"use client";

import { useEffect, useState } from "react";

export function SplashScreen() {
  const [show, setShow] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const seen = sessionStorage.getItem("tt_splash");
    if (!seen) {
      setShow(true);
      // Start fade out after 1.2s
      const t1 = setTimeout(() => setFadeOut(true), 1200);
      // Fully remove after 1.8s
      const t2 = setTimeout(() => {
        setShow(false);
        sessionStorage.setItem("tt_splash", "1");
      }, 1800);
      return () => { clearTimeout(t1); clearTimeout(t2); };
    }
  }, []);

  if (!show) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#000",
        transition: "opacity 0.6s ease, filter 0.6s ease",
        opacity: fadeOut ? 0 : 1,
        filter: fadeOut ? "blur(8px)" : "none",
        pointerEvents: fadeOut ? "none" : "auto",
      }}
    >
      <img
        src="/aethel-logo.png"
        alt="Aethel Solutions"
        style={{
          maxWidth: "220px",
          width: "80%",
          height: "auto",
          filter: "drop-shadow(0 0 24px rgba(201,168,76,0.35))",
          animation: "splashIn 0.8s ease-out both",
        }}
      />
      <style>{`
        @keyframes splashIn {
          from { opacity: 0; transform: scale(0.92); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
