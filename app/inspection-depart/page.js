"use client";

import { useState } from "react";
import ProgressionEtapes from "../components/ProgressionEtapes";

export default function InspectionDepart() {
  const [confirmation, setConfirmation] = useState(false);
  const [error, setError] = useState("");

  function handleContinue() {
    if (!confirmation) {
      setError(
        "Veuillez confirmer que vous avez pris et conservé les 5 photos demandées."
      );
      return;
    }

    setError("");
    window.location.href = "/code-acces";
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        width: "100%",
        background: "#0b0b0b",
        color: "#ffffff",
        fontFamily: "Arial, sans-serif",
        padding: "24px 20px 40px",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "430px",
          margin: "0 auto",
          textAlign: "center",
        }}
      >
        <ProgressionEtapes etape={4} />

        <img
          src="/logo-mt.PNG"
          alt="MT Location Remorques"
          style={{
            width: "240px",
            maxWidth: "80%",
            height: "auto",
            display: "block",
            margin: "0 auto 18px",
          }}
        />

        <h1
          style={{
            fontSize: "28px",
            margin: "0 0 8px",
          }}
        >
          Photos de départ
        </h1>

        <p
          style={{
            color: "#aaaaaa",
            fontSize: "15px",
            lineHeight: "1.5",
            margin: "0 0 20px",
          }}
        >
          Avant de partir, prenez les 5 photos suivantes avec l’appareil photo
          de votre téléphone.
        </p>

        <div
          style={{
            background: "#151515",
            border: "1px solid #444444",
            borderRadius: "14px",
            padding: "18px",
            textAlign: "left",
            marginBottom: "16px",
          }}
        >
          <div style={{ marginBottom: "12px", fontWeight: "700" }}>
            Photos à prendre :
          </div>

          <div style={{ lineHeight: "1.9", color: "#dddddd" }}>
            1. Avant de la remorque
            <br />
            2. Arrière de la remorque
            <br />
            3. Côté conducteur
            <br />
            4. Côté passager
            <br />
            5. Intérieur
          </div>
        </div>

        <div
          style={{
            background: "#151515",
            border: "1px solid #555555",
            borderRadius: "14px",
            padding: "16px",
            marginBottom: "16px",
            textAlign: "left",
          }}
        >
          <strong style={{ display: "block", marginBottom: "8px" }}>
            Important
          </strong>

          <div
            style={{
              color: "#bbbbbb",
              fontSize: "14px",
              lineHeight: "1.5",
            }}
          >
            Conservez ces photos sur votre téléphone jusqu’à la fermeture
            complète de la location. Elles pourront servir à confirmer l’état
            de la remorque au moment de la prise de possession.
          </div>
        </div>

        <label
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: "12px",
            textAlign: "left",
            background: "#151515",
            border: confirmation
              ? "1px solid #777777"
              : "1px solid #444444",
            borderRadius: "14px",
            padding: "16px",
            cursor: "pointer",
          }}
        >
          <input
            type="checkbox"
            checked={confirmation}
            onChange={(e) => {
              setConfirmation(e.target.checked);
              setError("");
            }}
            style={{
              width: "22px",
              height: "22px",
              marginTop: "1px",
              flexShrink: 0,
            }}
          />

          <span
            style={{
              fontSize: "15px",
              lineHeight: "1.45",
            }}
          >
            Je confirme avoir pris les 5 photos demandées et les avoir
            conservées sur mon téléphone.
          </span>
        </label>

        {error && (
          <p
            style={{
              color: "#ff6b6b",
              fontSize: "14px",
              lineHeight: "1.4",
              margin: "16px 0 0",
            }}
          >
            {error}
          </p>
        )}

        <button
          type="button"
          onClick={handleContinue}
          disabled={!confirmation}
          style={{
            width: "100%",
            marginTop: "20px",
            padding: "16px",
            border: "1px solid #666666",
            borderRadius: "12px",
            background: confirmation ? "#0b0b0b" : "#222222",
            color: confirmation ? "#ffffff" : "#777777",
            fontSize: "17px",
            fontWeight: "700",
            cursor: confirmation ? "pointer" : "default",
          }}
        >
          Continuer
        </button>
      </div>
    </main>
  );
}
