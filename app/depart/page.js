"use client";

import { useState } from "react";

export default function Depart() {
  const [email, setEmail] = useState("");
  const [telephone, setTelephone] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function continuer() {
    setMessage("");

    if (!email || !telephone) {
      setMessage("Veuillez entrer votre courriel et votre téléphone.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/booqable/reservation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          telephone,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setMessage(
          data.message || "Aucune réservation trouvée."
        );
        return;
      }

      localStorage.setItem(
        "mtReservation",
        JSON.stringify(data)
      );

      window.location.href = "/reservation";
    } catch (error) {
      setMessage("Erreur lors de la recherche de la réservation.");
    } finally {
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
        padding: "30px 20px",
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
        <img
          src="/logo-mt.PNG"
          alt="MT Location Remorques"
          style={{
            width: "280px",
            maxWidth: "90%",
            height: "auto",
            display: "block",
            margin: "0 auto 35px",
          }}
        />

        <h1
          style={{
            fontSize: "32px",
            marginBottom: "12px",
          }}
        >
          Départ
        </h1>

        <div
          style={{
            color: "#aaaaaa",
            fontSize: "18px",
            marginBottom: "32px",
          }}
        >
          Identifiez votre réservation.
        </div>

        <div
          style={{
            background: "#151515",
            border: "1px solid #444444",
            borderRadius: "18px",
            padding: "28px 20px",
            boxSizing: "border-box",
          }}
        >
          <h2
            style={{
              fontSize: "26px",
              margin: "0 0 35px",
            }}
          >
            Ma réservation
          </h2>

          <label
            style={{
              display: "block",
              fontSize: "18px",
              fontWeight: "700",
              marginBottom: "15px",
            }}
          >
            Courriel
          </label>

          <input
            type="email"
            value={email}
            placeholder="votre@email.com"
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: "100%",
              height: "58px",
              background: "#0b0b0b",
              border: "1px solid #555555",
              borderRadius: "12px",
              color: "#ffffff",
              fontSize: "18px",
              padding: "0 15px",
              boxSizing: "border-box",
              marginBottom: "35px",
            }}
          />

          <label
            style={{
              display: "block",
              fontSize: "18px",
              fontWeight: "700",
              marginBottom: "15px",
            }}
          >
            Téléphone
          </label>

          <input
            type="tel"
            value={telephone}
            placeholder="514 555-1234"
            onChange={(e) => setTelephone(e.target.value)}
            style={{
              width: "100%",
              height: "58px",
              background: "#0b0b0b",
              border: "1px solid #555555",
              borderRadius: "12px",
              color: "#ffffff",
              fontSize: "18px",
              padding: "0 15px",
              boxSizing: "border-box",
              marginBottom: "30px",
            }}
          />

          {message && (
            <div
              style={{
                color: "#ff6666",
                marginBottom: "20px",
              }}
            >
              {message}
            </div>
          )}

          <button
            type="button"
            onClick={continuer}
            disabled={loading}
            style={{
              width: "100%",
              minHeight: "65px",
              background: "#0b0b0b",
              border: "1px solid #666666",
              borderRadius: "14px",
              color: "#ffffff",
              fontSize: "21px",
              fontWeight: "700",
              cursor: "pointer",
            }}
          >
            {loading ? "Recherche..." : "Continuer"}
          </button>
        </div>
      </div>
    </main>
  );
}
