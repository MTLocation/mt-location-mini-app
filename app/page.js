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
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "430px",
          textAlign: "center",
        }}
      >
        {/* LOGO / IDENTITÉ */}
        <div style={{ marginBottom: "32px" }}>
          <div
            style={{
              fontSize: "30px",
              fontWeight: "700",
              lineHeight: "1.1",
            }}
          >
            MT LOCATION
          </div>

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

          <div
            style={{
              color: "#aaaaaa",
              marginTop: "18px",
              fontSize: "16px",
            }}
          >
            Remorque fermée 7 × 14
          </div>
        </div>

        {/* DÉBUTER */}
        <Link
          href="/prise-de-possession"
          style={{
            display: "flex",
            minHeight: "120px",
            background: "#151515",
            border: "1px solid #444444",
            borderRadius: "18px",
            padding: "24px",
            marginBottom: "18px",
            color: "#ffffff",
            textDecoration: "none",
            textAlign: "center",
            justifyContent: "center",
            boxSizing: "border-box",
          }}
        >
          <div style={{ width: "100%", textAlign: "center" }}>
            <div
              style={{
                fontSize: "23px",
                fontWeight: "700",
              }}
            >
              Débuter la location
            </div>

            <div
              style={{
                color: "#aaaaaa",
                marginTop: "8px",
                fontSize: "16px",
              }}
            >
              Prendre possession de votre remorque
            </div>
          </div>
        </Link>

        {/* RETOUR */}
        <Link
          href="/retour"
          style={{
            display: "flex",
            minHeight: "120px",
            background: "#151515",
            border: "1px solid #444444",
            borderRadius: "18px",
            padding: "24px",
            color: "#ffffff",
            textDecoration: "none",
            alignItems: "center",
        textAlign: "center",
            justifyContent: "center",
            boxSizing: "border-box",
          }}
        >
         <div style={{ width: "100%", textAlign: "center" }}>
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
                marginTop: "8px",
                fontSize: "16px",
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
