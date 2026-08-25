"use client";

import { useEffect, useState } from "react";

export default function CodeAccesPage() {
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function getPin() {
      try {
        const response = await fetch("/api/igloohome");
        const data = await response.json();

        if (!response.ok || !data.pin) {
          throw new Error(
            data.error || "Impossible d'obtenir le code."
          );
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

  async function handleCopyPin() {
    try {
      await navigator.clipboard.writeText(pin);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      setError("Impossible de copier le code.");
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        width: "100%",
        background: "#080808",
        color: "#ffffff",
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "center",
        padding: "5px 20px 20px",
        boxSizing: "border-box",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "430px",
          textAlign: "center",
        }}
      >
        <img
          src="/logo-mt.PNG"
          alt="MT Location Remorques"
          style={{
            width: "240px",
            maxWidth: "80%",
            height: "auto",
            display: "block",
            margin: "0 auto 28px",
          }}
        />

        <h1
          style={{
            width: "100%",
            margin: "0 0 10px",
            fontSize: "30px",
            textAlign: "center",
          }}
        >
          Votre code d’accès
        </h1>

        <p
          style={{
            width: "100%",
            margin: "0 0 22px",
            color: "#aaaaaa",
            fontSize: "16px",
            lineHeight: "1.4",
            textAlign: "center",
          }}
        >
          Utilisez ce code pour déverrouiller la remorque.
        </p>

        <div
          style={{
            width: "100%",
            background: "#151515",
            border: "1px solid #444444",
            borderRadius: "18px",
            padding: "28px 20px",
            boxSizing: "border-box",
            textAlign: "center",
          }}
        >
          {loading && (
            <div
              style={{
                fontSize: "17px",
                color: "#aaaaaa",
              }}
            >
              Génération du code...
            </div>
          )}

          {!loading && error && (
            <div
              style={{
                fontSize: "16px",
                color: "#aaaaaa",
                lineHeight: "1.4",
              }}
            >
              {error}
            </div>
          )}

         {!loading && !error && (
  <div
    style={{
      width: "100%",
      minHeight: "90px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexWrap: "nowrap",
      boxSizing: "border-box",
      padding: "0 8px",
      fontSize: "30px",
      fontWeight: "700",
      letterSpacing: "1px",
      textAlign: "center",
      whiteSpace: "nowrap",
      wordBreak: "normal",
      overflowWrap: "normal",
    }}
  >
    {String(pin).replace(/\D/g, "")}
  </div>
)}
        </div>

        {!loading && !error && (
          <>
            <button
              type="button"
              onClick={handleCopyPin}
              disabled={!pin}
              style={{
                width: "100%",
                marginTop: "14px",
                padding: "15px",
                border: "1px solid #666666",
                borderRadius: "12px",
                background: "#0b0b0b",
                color: "#ffffff",
                fontSize: "16px",
                fontWeight: "700",
                cursor: pin ? "pointer" : "default",
                textAlign: "center",
                boxSizing: "border-box",
              }}
            >
              {copied ? "Code copié ✓" : "Copier le code"}
            </button>

            <p
              style={{
                width: "100%",
                margin: "20px 0 0",
                color: "#aaaaaa",
                fontSize: "15px",
                lineHeight: "1.5",
                textAlign: "center",
              }}
            >
              Votre code restera valide jusqu’à 30 minutes après
              l’heure prévue de votre retour.
              <br />
              Veuillez nous aviser à l’avance de tout retard potentiel.
            </p>

            <div
              style={{
                marginTop: "28px",
                fontSize: "28px",
                fontWeight: "700",
                textAlign: "center",
              }}
            >
              Bonne route!
            </div>

            <p
              style={{
                margin: "8px 0 0",
                color: "#aaaaaa",
                fontSize: "15px",
                textAlign: "center",
              }}
            >
              MT Location Remorques
            </p>
          </>
        )}
      </div>
    </main>
  );
}
