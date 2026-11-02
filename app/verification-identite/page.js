"use client";

import { useState } from "react";
import ProgressionEtapes from "../components/ProgressionEtapes";

export default function VerificationIdentite() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function demarrerVerification() {
    if (loading) return;

    try {
      setLoading(true);
      setError("");

      const stored = sessionStorage.getItem("mtReservation");

      if (!stored) {
        throw new Error("Réservation introuvable.");
      }

      const reservationData = JSON.parse(stored);
      const orderId = reservationData?.reservation?.id;

      if (!orderId) {
        throw new Error("Numéro de réservation introuvable.");
      }

      const response = await fetch("/api/identity/create-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success || !data.url) {
        throw new Error(
          data.error ||
            "Impossible de démarrer la vérification d'identité."
        );
      }

      sessionStorage.setItem(
        "mtStripeIdentitySessionId",
        data.sessionId
      );

      window.location.href = data.url;
    } catch (err) {
      console.error("Erreur Identity :", err);

      setError(
        err?.message ||
          "Impossible de démarrer la vérification d'identité."
      );

      setLoading(false);
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
        <ProgressionEtapes etape={2} />

        <img
          src="/logo-mt.PNG"
          alt="MT Location Remorques"
          style={{
            width: "240px",
            maxWidth: "80%",
            height: "auto",
            display: "block",
            margin: "0 auto 26px",
          }}
        />

        <h1
          style={{
            fontSize: "28px",
            lineHeight: "1.2",
            margin: "0 auto 18px",
            textAlign: "center",
            width: "100%",
          }}
        >
          Mon identité
        </h1>

        <p
          style={{
            color: "#aaaaaa",
            fontSize: "15px",
            lineHeight: "1.6",
            margin: "0 auto 26px",
            textAlign: "center",
            maxWidth: "380px",
          }}
        >
         
        </p>

        <div
          style={{
            width: "100%",
            background: "#151515",
            border: "1px solid #444444",
            borderRadius: "14px",
            padding: "24px 18px",
            margin: "0 auto 22px",
            boxSizing: "border-box",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontWeight: "700",
              fontSize: "18px",
              lineHeight: "1.4",
              margin: "0 auto 18px",
              textAlign: "center",
            }}
          >
            Vous aurez besoin de :
          </div>

          <div
            style={{
              color: "#dddddd",
              fontSize: "15px",
              lineHeight: "1.9",
              textAlign: "center",
              margin: "0 auto",
            }}
          >
            Votre permis de conduire
            <br />
            votre caméra de cellulaire
            <br />
            Prendre un selfie
          </div>
        </div>

        <p
          style={{
            color: "#888888",
            fontSize: "13px",
            lineHeight: "1.5",
            margin: "0 auto 20px",
            textAlign: "center",
            maxWidth: "360px",
          }}
        >
         Vérification sécurisée effectuée par Stripe Identity.
        </p>

        {error && (
          <p
            style={{
              color: "#ff6b6b",
              fontSize: "14px",
              lineHeight: "1.5",
              margin: "0 auto 18px",
              textAlign: "center",
              maxWidth: "360px",
            }}
          >
            {error}
          </p>
        )}

        <button
          type="button"
          onClick={demarrerVerification}
          disabled={loading}
          style={{
            width: "100%",
            padding: "16px",
            border: "none",
            borderRadius: "14px",
            background: loading ? "#444444" : "#f2c94c",
            color: loading ? "#888888" : "#111111",
            fontSize: "18px",
            fontWeight: "700",
            lineHeight: "1.3",
            textAlign: "center",
            cursor: loading ? "default" : "pointer",
            display: "block",
            margin: "0 auto",
          }}
        >
          {loading
            ? "Ouverture de la vérification..."
            : "Vérifier mon identité"}
        </button>
      </div>
    </main>
  );
}
