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
    display: "grid",
    placeItems: "center",
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
        boxSizing: "border-box",
        padding: "30px 20px",
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
        <div
          style={{
            width: "100%",
            textAlign: "center",
            marginBottom: "36px",
          }}
        >
          <div
            style={{
              fontSize: "30px",
              fontWeight: "700",
              textAlign: "center",
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
              textAlign: "center",
            }}
          >
            REMORQUES
          </div>

          <div
            style={{
              marginTop: "20px",
              fontSize: "16px",
              textAlign: "center",
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
            }}
          >
            <div
              style={{
                width: "100%",
                fontSize: "23px",
                fontWeight: "700",
                textAlign: "center",
              }}
            >
              Débuter la location
            </div>

            <div
              style={{
  width: "100%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  textAlign: "center",
  fontSize: "23px",
  fontWeight: "700",
              }}
            >
              Prendre possession de votre remorque
            </div>
          </div>
        </Link>

        <div style={{ height: "18px" }} />

        <Link href="/retour" style={cardStyle}>
          <div
         style={{
  width: "100%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  textAlign: "center",
  color: "#aaaaaa",
  fontSize: "16px",
  marginTop: "12px",
}}
          >
            <div
              style={{
  width: "100%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  textAlign: "center",
  fontSize: "23px",
  fontWeight: "700",
}}
            >
              Retourner la remorque
            </div>

            <div
              style={{
                width: "100%",
                color: "#aaaaaa",
                fontSize: "16px",
                marginTop: "12px",
                textAlign: "center",
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
