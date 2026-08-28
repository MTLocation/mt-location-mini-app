"use client";
import ProgressionRetour from "../components/ProgressionRetour";
export default function RetourTermine() {
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
        padding: "20px",
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
<ProgressionRetour etape={4} />
      
        <img
          src="/logo-mt.PNG"
          alt="MT Location Remorques"
          style={{
            width: "240px",
            maxWidth: "85%",
            height: "auto",
            display: "block",
            margin: "0 auto 20px",
          }}
        />

        <div
          style={{
            width: "70px",
            height: "70px",
            borderRadius: "50%",
            background: "#f2c94c",
            color: "#111111",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "34px",
            fontWeight: "700",
            margin: "0 auto 20px",
          }}
        >
          ✓
        </div>

        <h1
          style={{
            fontSize: "30px",
            margin: "0 0 10px",
          }}
        >
          Réussi!
        </h1>

        <p
          style={{
            color: "#cccccc",
            fontSize: "17px",
            lineHeight: "24px",
            margin: "0 0 20px",
          }}
        >
          Merci! Retour complété.
        </p>

        <div
          style={{
            background: "#151515",
            border: "1px solid #444444",
            borderRadius: "18px",
            padding: "20px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: "16px",
              lineHeight: "24px",
            }}
          >
           assurez-vous de :
          </div>

          <div
            style={{
              marginTop: "6px",
              fontSize: "16px",
              lineHeight: "26px",
            }}
          >
            Verrouiller la remorque
            <br />
            Remettre les clés
            <br />
            Verrouiller le cadenas 
          </div>
        </div>
      </div>
    </main>
  );
}
