"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function RetourReservation() {
  const router = useRouter();
  const [data, setData] = useState(null);

  useEffect(() => {
    const saved = sessionStorage.getItem("mtReservation");

    if (!saved) {
      router.push("/retour");
      return;
    }

    setData(JSON.parse(saved));
  }, [router]);

  if (!data) {
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
        }}
      >
        Chargement...
      </main>
    );
  }

  const { customer, reservation } = data;

  const formatDate = (dateString) => {
    return new Intl.DateTimeFormat("fr-CA", {
      dateStyle: "long",
      timeStyle: "short",
      timeZone: "UTC",
    }).format(new Date(dateString));
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#0b0b0b",
        color: "#ffffff",
        fontFamily: "Arial, sans-serif",
        padding: "24px 20px",
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
            width: "240px",
            maxWidth: "80%",
            height: "auto",
            display: "block",
            margin: "0 auto 18px",
          }}
        />

        <h1
          style={{
            fontSize: "30px",
            margin: "0 0 8px",
          }}
        >
          Réservation trouvée
        </h1>

        <p
          style={{
            color: "#aaaaaa",
            fontSize: "16px",
            margin: "0 0 22px",
          }}
        >
          Confirmez votre réservation pour débuter le retour.
        </p>

        <div
          style={{
            background: "#151515",
            border: "1px solid #444444",
            borderRadius: "18px",
            padding: "20px",
            marginBottom: "18px",
            textAlign: "left",
          }}
        >
          <div style={{ marginBottom: "16px" }}>
            <div style={{ color: "#aaaaaa", fontSize: "14px" }}>
              Client
            </div>
            <div
              style={{
                fontSize: "20px",
                fontWeight: "700",
                marginTop: "4px",
              }}
            >
              {customer?.name || "Client"}
            </div>
          </div>

          <div style={{ marginBottom: "16px" }}>
            <div style={{ color: "#aaaaaa", fontSize: "14px" }}>
              Réservation
            </div>
            <div
              style={{
                fontSize: "20px",
                fontWeight: "700",
                marginTop: "4px",
              }}
            >
              #{reservation?.number || "-"}
            </div>
          </div>

          <div style={{ marginBottom: "16px" }}>
            <div style={{ color: "#aaaaaa", fontSize: "14px" }}>
              Début
            </div>
            <div style={{ fontSize: "17px", marginTop: "4px" }}>
              {formatDate(reservation?.startsAt)}
            </div>
          </div>

          <div>
            <div style={{ color: "#aaaaaa", fontSize: "14px" }}>
              Fin
            </div>
            <div style={{ fontSize: "17px", marginTop: "4px" }}>
              {formatDate(reservation?.stopsAt)}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => router.push("/inspection-retour")}
          style={{
            width: "100%",
            minHeight: "60px",
            background: "#f2c94c",
            color: "#111111",
            border: "none",
            borderRadius: "18px",
            fontSize: "19px",
            fontWeight: "700",
            cursor: "pointer",
          }}
        >
          Commencer le retour
        </button>
      </div>
    </main>
  );
}
