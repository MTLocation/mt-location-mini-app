"use client";

import { useEffect, useState } from "react";
export default function Reservation() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("mtReservation");

    if (stored) {
      try {
        setData(JSON.parse(stored));
      } catch {
        setData(null);
      }
    }
  }, []);

  function formatDate(dateString) {
    if (!dateString) return "Non disponible";

    const date = new Date(dateString);

    return new Intl.DateTimeFormat("fr-CA", {
      dateStyle: "long",
      timeStyle: "short",
      timeZone: "UTC",
    }).format(date);
  }

  if (!data) {
    return (
      <main
        style={{
          Height: "100vh",
          background: "#0b0b0b",
          color: "#ffffff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "Arial, sans-serif",
          padding: "4px 20px 12px",
          boxSizing: "border-box",
overflow: "hidden",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <h1>Réservation introuvable</h1>
          <p style={{ color: "#aaaaaa" }}>
            Veuillez recommencer la recherche.
          </p>
        </div>
      </main>
    );
  }

  const customer = data.customer || {};
  const reservation = data.reservation || {};

  return (
    <main
      style={{
        height: "100vh",
overflow: "hidden",
        background: "#0b0b0b",
        color: "#ffffff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Arial, sans-serif",
        padding: "8px 20px",
        boxSizing: "border-box",
overflow: "hidden",
      }}
    >
      <div style={{ width: "100%", maxWidth: "430px" }}>
        <div style={{ textAlign: "center", marginBottom: "6px" }}>
          <div
            style={{
              color: "#ff6b00",
              fontWeight: "700",
              marginBottom: "4px",
            }}
>
        <img
  src="/logo-mt.PNG"
  alt="MT Location Remorques"
  style={{
    width: "200px",
    maxWidth: "90%",
    height: "auto",
    display: "block",
    margin: "0 auto",
  }}
/>
  </div>
          <h1
  style={{
    fontSize: "28px",
    margin: "2px 0",
    width: "100%",
    textAlign: "center",
  }}
>
  Réservation trouvée ✓
</h1>

          <p
  style={{
    color: "#aaaaaa",
    textAlign: "center",
    margin: "2px 0 6px 0",
  }}
>
  Vérifiez les informations de votre location.
</p>
        </div>

        <div
          style={{
            background: "#151515",
            border: "1px solid #333333",
            borderRadius: "18px",
            padding: "10px 14px",
          }}
        >
          <div style={{ marginBottom: "6px" }}>
            <div style={{ color: "#aaaaaa", fontSize: "14px" }}>
              Client
            </div>

            <div style={{ fontSize: "20px", fontWeight: "700" }}>
              {customer.name || "Nom non disponible"}
            </div>
          </div>

          <div style={{ marginBottom: "6px" }}>
            <div style={{ color: "#aaaaaa", fontSize: "14px" }}>
              Réservation
            </div>

            <div style={{ fontSize: "18px" }}>
              {reservation.number || "Numéro non disponible"}
            </div>
          </div>

          <div style={{ marginBottom: "6px" }}>
            <div style={{ color: "#aaaaaa", fontSize: "14px" }}>
              Prise de possession
            </div>

            <div style={{ fontSize: "18px" }}>
              {formatDate(reservation.startsAt)}
            </div>
          </div>

          <div style={{ marginBottom: "6px" }}>
            <div style={{ color: "#aaaaaa", fontSize: "14px" }}>
              Retour
            </div>

            <div style={{ fontSize: "18px" }}>
              {formatDate(reservation.stopsAt)}
            </div>
          </div>

          <button
            type="button"
            style={{
              width: "100%",
              padding: "17px",
              border: "1px solid #666666",
              borderRadius: "12px",
              background: "#000000",
              color: "#ffffff",
              fontSize: "17px",
              fontWeight: "700",
              cursor: "pointer",
            }}
          >
            Vérifier mon identité
          </button>
        </div>
      </div>
    </main>
  );
}
