"use client";

import { useState } from "react";

export default function VerificationIdentite() {
  const [photos, setPhotos] = useState({
    permisRecto: null,
    permisVerso: null,
    assurance: null,
    visage: null,
  });

  const photoLabels = {
    permisRecto: "PERMIS — RECTO",
    permisVerso: "PERMIS — VERSO",
    assurance: "PREUVE D’ASSURANCE",
    visage: "PHOTO DU VISAGE",
  };

  function handlePhotoChange(key, file) {
    if (!file) return;

    setPhotos((prev) => ({
      ...prev,
      [key]: {
        file,
        preview: URL.createObjectURL(file),
      },
    }));
  }

  const allPhotosTaken = Object.values(photos).every(Boolean);

  return (
    <main
      style={{
        minHeight: "100vh",
        width: "100%",
        background: "#0b0b0b",
        color: "#ffffff",
        fontFamily: "Arial, sans-serif",
        padding: "24px 20px 40px",
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
            maxWidth: "80%",
            height: "auto",
            display: "block",
            margin: "0 auto 18px",
          }}
        />

        <h1
          style={{
            fontSize: "28px",
            margin: "0 0 8px",
          }}
        >
          Vérification d’identité
        </h1>

        <p
          style={{
            color: "#aaaaaa",
            fontSize: "15px",
            lineHeight: "1.4",
            margin: "0 0 22px",
          }}
        >
          Prenez les 4 photos demandées.
        </p>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
          }}
        >
          {Object.keys(photoLabels).map((key) => (
            <div
              key={key}
              style={{
                background: "#151515",
                border: "1px solid #444444",
                borderRadius: "14px",
                padding: "14px",
              }}
            >
              <div
                style={{
                  fontWeight: "700",
                  marginBottom: "10px",
                }}
              >
                {photoLabels[key]}
              </div>

              {photos[key]?.preview && (
                <img
                  src={photos[key].preview}
                  alt={photoLabels[key]}
                  style={{
                    width: "100%",
                    maxHeight: "180px",
                    objectFit: "cover",
                    borderRadius: "10px",
                    marginBottom: "10px",
                  }}
                />
              )}

              <label
                style={{
                  display: "block",
                  position: "relative",
                  width: "100%",
                  minHeight: "52px",
                  padding: "14px",
                  boxSizing: "border-box",
                  border: "1px solid #666666",
                  borderRadius: "10px",
                  background: "#0b0b0b",
                  cursor: "pointer",
                  fontWeight: "700",
                }}
              >
                <span
                  style={{
                    position: "absolute",
                    left: "50%",
                    top: "50%",
                    transform: "translate(-50%, -50%)",
                    whiteSpace: "nowrap",
                  }}
                >
                  {photos[key] ? "Reprendre" : "Photo"}
                </span>

                <input
                  type="file"
                  accept="image/*"
                  capture={key === "visage" ? "user" : "environment"}
                  onChange={(e) =>
                    handlePhotoChange(key, e.target.files?.[0])
                  }
                  style={{
                    display: "none",
                  }}
                />
              </label>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={() => {
            window.location.href = "/contrat";
          }}
          disabled={!allPhotosTaken}
          style={{
            width: "100%",
            marginTop: "20px",
            padding: "16px",
            border: "1px solid #666666",
            borderRadius: "12px",
            background: allPhotosTaken ? "#0b0b0b" : "#222222",
            color: allPhotosTaken ? "#ffffff" : "#777777",
            fontSize: "17px",
            fontWeight: "700",
            cursor: allPhotosTaken ? "pointer" : "default",
          }}
        >
          Continuer
        </button>
      </div>
    </main>
  );
}
