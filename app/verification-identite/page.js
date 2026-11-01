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
            margin: "0 auto 18px",
          }}
        />

        <h1
          style={{
            fontSize: "28px",
            margin: "0 0 8px",
          }}
        >
          Vérification d’identité
        </h1>

        <p
          style={{
            color: "#aaaaaa",
            fontSize: "15px",
            lineHeight: "1.5",
            margin: "0 0 24px",
          }}
        >
          Pour votre sécurité et celle de MT Location Remorques, Stripe
          vérifiera votre permis de conduire et votre identité.
        </p>

        <div
          style={{
            background: "#151515",
            border: "1px solid #444444",
            borderRadius: "14px",
            padding: "18px",
            marginBottom: "20px",
            textAlign: "left",
          }}
        >
          <div
            style={{
              fontWeight: "700",
              marginBottom: "12px",
            }}
          >
            Vous aurez besoin de :
          </div>

          <div
            style={{
              color: "#dddddd",
              fontSize: "15px",
              lineHeight: "1.8",
            }}
          >
            • Votre permis de conduire
            <br />
            • La caméra de votre téléphone
            <br />
            • Quelques instants pour prendre un selfie
          </div>
        </div>

        <p
          style={{
            color: "#888888",
            fontSize: "13px",
            lineHeight: "1.5",
            margin: "0 0 18px",
          }}
        >
          La vérification est effectuée de façon sécurisée par Stripe.
        </p>

        {error && (
          <p
            style={{
              color: "#ff6b6b",
              fontSize: "14px",
              lineHeight: "1.4",
              margin: "0 0 16px",
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
            cursor: loading ? "default" : "pointer",
          }}
        >
          {loading ? "Ouverture de la vérification..." : "Vérifier mon identité"}
        </button>
      </div>
    </main>
  );
}
