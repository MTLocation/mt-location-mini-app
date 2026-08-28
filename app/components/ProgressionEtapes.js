export default function ProgressionEtapes({ etape }) {
  const etapes = ["Départ", "Identité", "Contrat", "Photos"];

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "390px",
        margin: "0 auto 12px",
        display: "flex",
        alignItems: "flex-start",
      }}
    >
      {etapes.map((nom, index) => {
        const numero = index + 1;
        const terminee = numero < etape;
        const active = numero === etape;

        return (
          <div
            key={nom}
            style={{
              flex: 1,
              position: "relative",
              textAlign: "center",
            }}
          >
            {index > 0 && (
              <div
                style={{
                  position: "absolute",
                  top: "13px",
                  right: "50%",
                  width: "100%",
                  height: "2px",
                  background:
                    numero <= etape ? "#ffffff" : "#444444",
                  zIndex: 0,
                }}
              />
            )}

            <div
              style={{
                position: "relative",
                zIndex: 1,
                width: "28px",
                height: "28px",
                margin: "0 auto",
                borderRadius: "50%",
                border: active
                  ? "2px solid #ffffff"
                  : "2px solid #555555",
                background:
                  terminee || active ? "#ffffff" : "#151515",
                color:
                  terminee || active ? "#000000" : "#777777",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "13px",
                fontWeight: "700",
                boxSizing: "border-box",
              }}
            >
              {terminee ? "✓" : numero}
            </div>

            <div
              style={{
                marginTop: "5px",
                fontSize: "11px",
                color:
                  active || terminee ? "#ffffff" : "#777777",
                fontWeight: active ? "700" : "400",
              }}
            >
              {nom}
            </div>
          </div>
        );
      })}
    </div>
  );
}
