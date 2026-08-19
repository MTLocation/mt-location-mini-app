export default function Home() {
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
        
        <div style={{ textAlign: "center", marginBottom: "45px" }}>
          <h1 style={{ fontSize: "30px", marginBottom: "8px" }}>
            MT LOCATION
          </h1>

          <div
            style={{
              color: "#ff6b00",
              fontSize: "22px",
              fontWeight: "bold",
            }}
          >
            REMORQUES
          </div>

          <p style={{ color: "#aaa", marginTop: "12px" }}>
            Remorque fermée 7 × 14
          </p>
        </div>

        <button
          style={{
            width: "100%",
            background: "#151515",
            border: "1px solid #444",
            borderRadius: "18px",
            padding: "24px",
            marginBottom: "18px",
            color: "white",
            textAlign: "left",
            cursor: "pointer",
          }}
        >
          <div style={{ fontSize: "23px", fontWeight: "bold" }}>
            Débuter la location
          </div>

          <div style={{ color: "#aaa", fontSize: "16px", marginTop: "6px" }}>
            Prendre possession de votre remorque
          </div>
        </button>

        <button
          style={{
            width: "100%",
            background: "#151515",
            border: "1px solid #444",
            borderRadius: "18px",
            padding: "24px",
            color: "white",
            textAlign: "left",
            cursor: "pointer",
          }}
        >
          <div style={{ fontSize: "23px", fontWeight: "bold" }}>
            Retourner la remorque
          </div>

          <div style={{ color: "#aaa", fontSize: "16px", marginTop: "6px" }}>
            Finaliser votre location
          </div>
        </button>

      </div>
    </main>
  );
}
