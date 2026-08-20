"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
export default function PriseDePossession() {
  const [email, setEmail] = useState("");
  const [telephone, setTelephone] = useState("");
const router = useRouter();
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#0b0b0b",
        color: "#ffffff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Arial, sans-serif",
        padding: "20px",
      }}
    >
      <div style={{ width: "100%", maxWidth: "430px" }}>
        <div style={{ textAlign: "center", marginBottom: "30px" }}>
          <div
            style={{
              color: "#ff6b00",
              fontWeight: "700",
              marginBottom: "10px",
            }}
          >
            MT LOCATION REMORQUES
          </div>

          <h1 style={{ fontSize: "28px", marginBottom: "10px" }}>
            Prise de possession
          </h1>

          <p style={{ color: "#aaaaaa" }}>
            Retrouvez votre réservation pour continuer.
          </p>
        </div>

        <div
          style={{
            background: "#151515",
            border: "1px solid #333333",
            borderRadius: "18px",
            padding: "24px",
          }}
        >
          <h2 style={{ marginTop: 0 }}>Retrouver ma réservation</h2>

          <label style={{ display: "block", marginTop: "20px" }}>
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
              marginTop: "8px",
              padding: "15px",
              borderRadius: "10px",
              border: "1px solid #444444",
              background: "#0b0b0b",
              color: "#ffffff",
              fontSize: "16px",
            }}
          />

          <label style={{ display: "block", marginTop: "20px" }}>
            Téléphone
          </label>

          <input
            type="tel"
            value={telephone}
            onChange={(e) => setTelephone(e.target.value)}
            placeholder="514 555-1234"
            style={{
              width: "100%",
              boxSizing: "border-box",
              marginTop: "8px",
              padding: "15px",
              borderRadius: "10px",
              border: "1px solid #444444",
              background: "#0b0b0b",
              color: "#ffffff",
              fontSize: "16px",
            }}
          />

          <button
            type="button"
onClick={() => router.push("/reservation")}
            style={{
              width: "100%",
              marginTop: "26px",
              padding: "17px",
              border: "none",
              borderRadius: "12px",
              background: "#ff6b00",
              color: "#ffffff",
              fontSize: "18px",
              fontWeight: "700",
              cursor: "pointer",
            }}
          >
            Continuer
          </button>
        </div>
      </div>
    </main>
  );
}
