import Link from "next/link";

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

        <Link
          href="/prise-de-possession"
          style={{
            display: "block",
            width: "100
