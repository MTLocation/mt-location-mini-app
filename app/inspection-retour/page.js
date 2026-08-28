"use client";

import { useRouter } from "next/navigation";

export default function InspectionRetour() {
  const router = useRouter();

  function choisirEtat(etat) {
    sessionStorage.setItem("mtEtatRetour", etat);
    router.push("/photos-retour");
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
        alignItems: "center",
        justifyContent: "center",
        padding: "18px 20px",
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
            maxWidth: "85%",
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
          Déclaration
        </h1>

        <p
          style={{
            color: "#aaaaaa",
            fontSize: "16px",
            lineHeight: "22px",
            margin: "0 0 24px",
          }}
        >
          Avez-vous un dommage à déclaré?
        </p>

        <button
          type="button"
          onClick={() => choisirEtat("aucun-dommage")}
          style={{
            width: "100%",
            minHeight: "64px",
            marginBottom: "14px",
            background: "#151515",
            color: "#ffffff",
            border: "1px solid #555555",
            borderRadius: "18px",
            fontSize: "19px",
            fontWeight: "700",
            cursor: "pointer",
          }}
        >
          Aucun dommage
        </button>

        <button
          type="button"
          onClick={() => choisirEtat("dommage")}
          style={{
            width: "100%",
            minHeight: "64px",
            background: "#151515",
            color: "#ffffff",
            border: "1px solid #555555",
            borderRadius: "18px",
            fontSize: "19px",
            fontWeight: "700",
            cursor: "pointer",
          }}
        >
          Déclarer un dommage
        </button>
      </div>
    </main>
  );
}
