"use client";

import { useEffect, useState } from "react";

export default function PriseDePossession() {
  const [remorque, setRemorque] = useState("7x14");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const valeur = params.get("remorque");

    if (valeur) {
      setRemorque(valeur);
    }
  }, []);

  const remorqueLabel =
    remorque === "7x14"
      ? "MT-01-7x14"
      : remorque;

  const cardStyle = {
    width: "100%",
    minHeight: "150px",
    background: "#151515",
    border: "1px solid #444444",
    borderRadius: "18px",
    color: "#ffffff",
    textDecoration: "none",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    padding: "24px",
    boxSizing: "border-box",
    cursor: "pointer",
  };

  function goDepart() {
    window.location.href =
      `/depart?remorque=${encodeURIComponent(remorque)}`;
  }

  function goRetour() {
    window.location.href =
      `/retour?remorque=${encodeURIComponent(remorque)}`;
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
        <div style={{ marginBottom: "36px" }}>
          <img
            src="/logo-mt.PNG"
            alt="MT Location Remorques"
            style={{
              width: "280px",
              maxWidth: "90%",
              height: "auto",
              display: "block",
              margin: "0 auto",
            }}
          />

          <div
            style={{
              marginTop: "20px",
              fontSize: "16px",
              fontWeight: "700",
            }}
          >
            {remorqueLabel}
          </div>
        </div>

        <button
          type="button"
          onClick={goDepart}
          style={{
            ...cardStyle,
            fontFamily: "Arial, sans-serif",
          }}
        >
          <div
            style={{
              fontSize: "23px",
              fontWeight: "700",
            }}
          >
            Débuter 
          </div>

          <div
            style={{
              color: "#aaaaaa",
              fontSize: "16px",
              marginTop: "12px",
            }}
          >
            Prise de possession
          </div>
        </button>

        <div style={{ height: "18px" }} />

        <button
          type="button"
          onClick={goRetour}
          style={{
            ...cardStyle,
            fontFamily: "Arial, sans-serif",
          }}
        >
          <div
            style={{
              fontSize: "23px",
              fontWeight: "700",
            }}
          >
            Retour 
          </div>

          <div
            style={{
              color: "#aaaaaa",
              fontSize: "16px",
              marginTop: "12px",
            }}
          >
            Finaliser votre location
          </div>
        </button>
      </div>
    </main>
  );
}
