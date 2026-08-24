"use client";

import { useEffect, useState } from "react";

export default function CodeAccesPage() {
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function getPin() {
      try {
        const response = await fetch("/api/igloohome");
        const data = await response.json();

        if (!response.ok || !data.pin) {
          throw new Error(data.error || "Impossible d'obtenir le code.");
        }

        setPin(data.pin);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    getPin();
  }, []);

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#080808",
        color: "#ffffff",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        textAlign: "center",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <img
        src="/logo.png"
        alt="MT Location Remorques"
        style={{
          width: "260px",
          maxWidth: "80%",
          marginBottom: "50px",
        }}
      />

      <h1
        style={{
          fontSize: "34px",
          margin: "0 0 14px 0",
        }}
      >
        Votre code d’accès
      </h1>

      <p
        style={{
          color: "#aaaaaa",
          fontSize: "18px",
          marginBottom: "35px",
        }}
      >
        Utilisez ce code pour déverrouiller la remorque.
      </p>

      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          background: "#151515",
          border: "1px solid #444444",
          borderRadius: "18px",
          padding: "30px 20px",
          boxSizing: "border-box",
        }}
      >
        {loading && (
          <div style={{ fontSize: "18px", color: "#aaaaaa" }}>
            Génération du code...
          </div>
        )}

        {!loading && error && (
          <div style={{ fontSize: "17px", color: "#aaaaaa" }}>
            {error}
          </div>
        )}

        {!loading && !error && (
          <div
            style={{
              fontSize: "42px",
              fontWeight: "700",
              letterSpacing: "5px",
            }}
          >
            {pin}
          </div>
        )}
      </div>

      {!loading && !error && (
        <>
          <div
            style={{
              marginTop: "45px",
              fontSize: "28px",
              fontWeight: "700",
            }}
          >
            Bonne route!
          </div>

          <p
            style={{
              marginTop: "12px",
              color: "#aaaaaa",
              fontSize: "16px",
            }}
          >
            MT Location Remorques
          </p>
        </>
      )}
    </main>
  );
}
