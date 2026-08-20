"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function PriseDePossession() {
  const [email, setEmail] = useState("");
  const [telephone, setTelephone] = useState("");
  const [loading, setLoading] = useState(false);
  const [erreur, setErreur] = useState("");

  const router = useRouter();

  async function rechercherReservation() {
    setErreur("");

    if (!email.trim()) {
      setErreur("Veuillez entrer votre courriel.");
      return;
    }

    if (!telephone.trim()) {
      setErreur("Veuillez entrer votre numéro de téléphone.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("/api/booqable/reservation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          telephone: telephone.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setErreur(
          data.message || "Aucune réservation correspondante trouvée."
        );
        return;
      }

      sessionStorage.setItem(
        "mtReservation",
        JSON.stringify(data)
      );

      router.push("/reservation");
    } catch (error) {
      setErreur(
        "Impossible de rechercher la réservation pour le moment."
      );
    } finally {
      setLoading(false);
    }
  }

  const inputStyle = {
    width: "100%",
    boxSizing: "border-box",
    marginTop: "8px",
    padding: "15px",
    borderRadius: "10px",
    border: "1px solid #444444",
    background: "#0b0b0b",
    color: "#ffffff",
    fontSize: "16px",
  };

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
        padding: "30px 20px",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "430px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            width: "100%",
            textAlign: "center",
            marginBottom: "34px",
          }}
        >
          <div
            style={{
              color: "#ff6b00",
              fontWeight: "700",
              fontSize: "16px",
              textAlign: "center",
              marginBottom: "24px",
            }}
          >
            MT LOCATION REMORQUES
          </div>

          <h1
            style={{
              margin: 0,
              fontSize: "30px",
              textAlign: "center",
            }}
          >
            Prise de possession
          </h1>

          <p
            style={{
              color: "#aaaaaa",
              marginTop: "24px",
              marginBottom: 0,
              textAlign: "center",
              fontSize: "16px",
            }}
          >
            Retrouvez votre réservation pour continuer.
          </p>
        </div>

        <div
          style={{
            width: "100%",
            background: "#151515",
            border: "1px solid #444444",
            borderRadius: "18px",
            padding: "24px",
            boxSizing: "border-box",
          }}
        >
          <h2
            style={{
              margin: 0,
              marginBottom: "28px",
              textAlign: "center",
              fontSize: "24px",
            }}
          >
            Retrouver ma réservation
          </h2>

          <label
            style={{
              display: "block",
              marginBottom: "20px",
            }}
          >
            <div
              style={{
                width: "100%",
                textAlign: "center",
                fontWeight: "700",
                marginBottom: "8px",
              }}
            >
              Courriel
            </div>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="votre@email.com"
              style={inputStyle}
            />
          </label>

          <label
            style={{
              display: "block",
              marginBottom: "20px",
            }}
          >
            <div
              style={{
                width: "100%",
                textAlign: "center",
                fontWeight: "700",
                marginBottom: "8px",
              }}
            >
              Téléphone
            </div>

            <input
              type="tel"
              value={telephone}
              onChange={(e) => setTelephone(e.target.value)}
              placeholder="514 555-1234"
              style={inputStyle}
            />
          </label>

          {erreur && (
            <div
              style={{
                marginBottom: "16px",
                color: "#ff6b6b",
                fontSize: "14px",
                textAlign: "center",
              }}
            >
              {erreur}
            </div>
          )}

          <button
            type="button"
            onClick={rechercherReservation}
            disabled={loading}
            style={{
              width: "100%",
              marginTop: "6px",
              padding: "17px",
              border: "none",
              borderRadius: "12px",
              background: "#ff6b00",
              color: "#ffffff",
              fontSize: "18px",
              fontWeight: "700",
              cursor: loading ? "default" : "pointer",
              opacity: loading ? 0.7 : 1,
              textAlign: "center",
            }}
          >
            {loading ? "Recherche..." : "Continuer"}
          </button>
        </div>
      </div>
    </main>
  );
}
