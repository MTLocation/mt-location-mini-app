export default function Reservation() {
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
              marginBottom: "12px",
            }}
          >
            MT LOCATION REMORQUES
          </div>

          <h1 style={{ fontSize: "28px", marginBottom: "10px" }}>
            Réservation trouvée ✓
          </h1>

          <p style={{ color: "#aaaaaa" }}>
            Vérifiez les informations de votre location.
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
          <div style={{ marginBottom: "22px" }}>
            <div style={{ color: "#aaaaaa", fontSize: "14px" }}>
              Client
            </div>
            <div style={{ fontSize: "20px", fontWeight: "700" }}>
              Matthieu Trépanier
            </div>
          </div>

          <div style={{ marginBottom: "22px" }}>
            <div style={{ color: "#aaaaaa", fontSize: "14px" }}>
              Réservation
            </div>
            <div style={{ fontSize: "18px" }}>
              MT-001
            </div>
          </div>

          <div style={{ marginBottom: "22px" }}>
            <div style={{ color: "#aaaaaa", fontSize: "14px" }}>
              Prise de possession
            </div>
            <div style={{ fontSize: "18px" }}>
              22 août 2026 • 18:00
            </div>
          </div>

          <div style={{ marginBottom: "26px" }}>
            <div style={{ color: "#aaaaaa", fontSize: "14px" }}>
              Retour
            </div>
            <div style={{ fontSize: "18px" }}>
              23 août 2026 • 18:00
            </div>
          </div>

          <button
            type="button"
            style={{
              width: "100%",
              padding: "17px",
              border: "none",
              borderRadius: "12px",
              background: "#ff6b00",
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
