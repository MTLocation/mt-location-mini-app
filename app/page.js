import Link from "next/link";

export default function Home() {
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
        <div style={{ textAlign: "center", marginBottom: "36px" }}>
          <h1 style={{ margin: 0, fontSize: "30px" }}>MT LOCATION</h1>

          <div
            style={{
              marginTop: "8px",
              color: "#ff6b00",
              fontSize: "22px",
              fontWeight: "700",
            }}
          >
            REMORQUES
          </div>

          <p style={{ color: "#aaaaaa", marginTop: "12px" }}>
            Remorque fermée 7 × 14
          </p>
        </div>

        <Link
          href="/prise-de-possession"
          style={{
            display: "block",
            background: "#151515",
            border: "1px solid #444444",
            borderRadius: "18px",
            padding: "24px",
            marginBottom: "18px",
            color: "#ffffff",
            textDecoration: "none",
          }}
        >
          <div style={{ fontSize: "23px", fontWeight: "700" }}>
            Débuter la location
          </div>

          <div style={{ color: "#aaaaaa", marginTop: "6px" }}>
            Prendre possession de votre remorque
          </div>
        </Link>

        <Link
          href="/retour"
          style={{
            display: "block",
            background: "#151515",
            border: "1px solid #444444",
            borderRadius: "18px",
            padding: "24px",
            color: "#ffffff",
            textDecoration: "none",
          }}
        >
          <div style={{ fontSize: "23px", fontWeight: "700" }}>
            Retourner la remorque
          </div>

          <div style={{ color: "#aaaaaa", marginTop: "6px" }}>
            Finaliser votre location
          </div>
        </Link>
      </div>
    </main>
  );
}
