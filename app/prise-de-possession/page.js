"use client";

import { useState } from "react";

export default function PriseDePossession() {
  const [email, setEmail] = useState("");
  const [telephone, setTelephone] = useState("");

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#0b0b0b",
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Arial, sans-serif",
        padding: "20px",
      }}
    >
      <div style={{ width: "100%", maxWidth: "430px" }}>
        <div style={{ textAlign: "center", marginBottom: "35px" }}>
          <div
            style={{
              color: "#ff6b00",
              fontWeight: "bold",
              marginBottom: "10px",
            }}
          >
            MT LOCATION REMORQUES
          </div>

          <h1 style={{ fontSize: "28px", marginBottom: "10px" }}>
            Prise de possession
          </h1>

          <p style={{ color: "#aaa", lineHeight: "1.5" }}>
            Retrouvez votre réservation pour débuter votre location.
          </p>
        </div>

        <div
          style={{
            background: "#151515",
            border: "1px solid #333",
            borderRadius: "18px",
            padding: "24px",
          }}
        >
          <h2 style={{ fontSize: "20px", marginTop: 0 }}>
            Retrouver ma réservation
          </h2>

          <label
            style={{
              display: "block",
              marginTop: "22px",
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
              border: "1px solid #444",
              background: "#0b0b0b",
              color: "white",
              fontSize: "16px",
            }}
          />

          <label
            style={{
              display: "block",
              marginTop: "20px",
              marginBottom: "8px",
            }}
          >
            Téléphone
          </label>

          <input
            type="tel"
            value={telephone}
            onChange={(e) => setTelephone(e.target.value)}
            placeholder="514 555-1234"
            style={{
              width: "100
