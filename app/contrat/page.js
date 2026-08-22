"use client";

import { useEffect, useState } from "react";

export default function Contrat() {
  const [email, setEmail] = useState("");

  useEffect(() => {
    const stored = sessionStorage.getItem("mtReservation");

    if (stored) {
      try {
        const data = JSON.parse(stored);
        setEmail(data?.customer?.email || "");
      } catch {
        setEmail("");
      }
    }
  }, []);
async function handleSendContract() {
  try {
    const response = await fetch("/api/booqable/contrat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    const result = await response.json();

    if (!response.ok) {
      alert(result.message || "Erreur lors de l'envoi du contrat.");
      return;
    }

    alert("Contrat envoyé avec succès.");
  } catch (error) {
    alert("Erreur lors de l'envoi du contrat.");
  }
}
  return (
    <main
      style={{
        minHeight: "100vh",
        width: "100%",
        background: "#0b0b0b",
        color: "#ffffff",
        fontFamily: "Arial, sans-serif",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "16px 20px",
        boxSizing: "border-box",
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
            width: "260px",
            maxWidth: "85%",
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
          Recevoir le contrat
        </h1>

        <p
          style={{
            color: "#aaaaaa",
            fontSize: "16px",
            lineHeight: "1.4",
            margin: "0 0 22px",
          }}
        >
          Votre identité a été vérifiée avec succès.
          <br />
          Votre contrat sera envoyé par courriel.
        </p>

        <div
          style={{
            background: "#151515",
            border: "1px solid #444444",
            borderRadius: "18px",
            padding: "20px",
            textAlign: "left",
          }}
        >
          <label
            style={{
              display: "block",
              fontSize: "15px",
              fontWeight: "700",
              marginBottom: "8px",
            }}
          >
            Courriel
          </label>

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="votre@email.com"
            style={{
              width: "100%",
              boxSizing: "border-box",
              padding: "15px",
              borderRadius: "10px",
              border: "1px solid #444444",
              background: "#0b0b0b",
              color: "#ffffff",
              fontSize: "16px",
              marginBottom: "16px",
            }}
          />

          <button
            type="button"
onClick={handleSendContract}
            style={{
              width: "100%",
              padding: "16px",
              border: "1px solid #666666",
              borderRadius: "12px",
              background: "#0b0b0b",
              color: "#ffffff",
              fontSize: "17px",
              fontWeight: "700",
              cursor: "pointer",
            }}
          >
            Envoyer mon contrat
          </button>
        </div>
      </div>
    </main>
  );
}
