import Link from "next/link";

export default function Home() {
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
  };

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
        <div style={{ marginBottom: "36px", textAlign: "center" }}>
          <div
            style={{
              fontSize: "30px",
              fontWeight: "700",
            }}
          >
            MT LOCATION
          </div>

          <div
            style={{
              color: "#ff6b00",
              fontSize: "22px",
              fontWeight: "700",
              marginTop: "8px",
            }}
          >
            REMORQUES
          </div>

          <div
            style={{
              marginTop: "20px",
              fontSize: "16px",
            }}
          >
            Remorque fermée 7 × 14
          </div>
        </div>

        <Link href="/prise-de-possession" style={cardStyle}>
          <div
            style={{
              width: "100%",
              textAlign: "center",
              fontSize: "23px",
              fontWeight: "700",
            }}
          >
            Débuter la location
          </div>

          <div
            style={{
              width: "100%",
              textAlign: "center",
              color: "#aaaaaa",
              fontSize: "16px",
              marginTop: "12px",
            }}
          >
            Prendre possession de votre remorque
          </div>
        </Link>

        <div style={{ height: "18px" }} />

       <Link href="/retour" style={cardStyle}>
  <div
    style={{
      width: "100%",
      height: "100%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      textAlign: "center",
    }}
  >
    <div
      style={{
        fontSize: "23px",
        fontWeight: "700",
      }}
    >
      Retourner la remorque
    </div>

    <div
      style={{
        color: "#aaaaaa",
        fontSize: "16px",
        fontWeight: "400",
        marginTop: "12px",
      }}
    >
      Finaliser votre location
    </div>
  </div>
</Link>
      </div>
    </main>
  );
}
