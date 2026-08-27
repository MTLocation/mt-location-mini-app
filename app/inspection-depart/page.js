"use client";

import { useState } from "react";

export default function InspectionDepart() {
  const [photos, setPhotos] = useState({
    avant: null,
    arriere: null,
    conducteur: null,
    passager: null,
    interieur: null,
  });

  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const photoLabels = {
    avant: "AVANT",
    arriere: "ARRIÈRE",
    conducteur: "CÔTÉ CONDUCTEUR",
    passager: "CÔTÉ PASSAGER",
    interieur: "INTÉRIEUR",
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

    setError("");
  }

  const allPhotosTaken = Object.values(photos).every(Boolean);

  async function handleContinue() {
    if (!allPhotosTaken || uploading) return;

    try {
      setUploading(true);
      setError("");

      const stored = sessionStorage.getItem("mtReservation");

      if (!stored) {
        throw new Error("Réservation introuvable.");
      }

      const reservationData = JSON.parse(stored);
      const orderId = reservationData?.reservation?.id;

      if (!orderId) {
        throw new Error("Numéro de réservation introuvable.");
      }

      for (const [photoType, photoData] of Object.entries(photos)) {
        const formData = new FormData();

        formData.append("file", photoData.file);
        formData.append("orderId", orderId);
        formData.append("category", "inspection-depart");
        formData.append("photoType", photoType);

        const response = await fetch("/api/photos/upload", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.error || `Erreur lors de l'envoi de la photo ${photoType}.`
          );
        }
      }

      window.location.href = "/code-acces";
    } catch (err) {
      setError(err.message || "Impossible d'enregistrer les photos.");
      setUploading(false);
    }
  }

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
          Photos
        </h1>

        <p
          style={{
            color: "#aaaaaa",
            fontSize: "15px",
            lineHeight: "1.4",
            margin: "0 0 22px",
          }}
        >
          Prenez les photos demandées.
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
                  cursor: uploading ? "default" : "pointer",
                  fontWeight: "700",
                  opacity: uploading ? 0.6 : 1,
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
                  capture="environment"
                  disabled={uploading}
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

        {error && (
          <p
            style={{
              color: "#ff6b6b",
              fontSize: "14px",
              lineHeight: "1.4",
              margin: "18px 0 0",
            }}
          >
            {error}
          </p>
        )}

        <button
          type="button"
          onClick={handleContinue}
          disabled={!allPhotosTaken || uploading}
          style={{
            width: "100%",
            marginTop: "20px",
            padding: "16px",
            border: "1px solid #666666",
            borderRadius: "12px",
            background:
              allPhotosTaken && !uploading ? "#0b0b0b" : "#222222",
            color:
              allPhotosTaken && !uploading ? "#ffffff" : "#777777",
            fontSize: "17px",
            fontWeight: "700",
            cursor:
              allPhotosTaken && !uploading ? "pointer" : "default",
          }}
        >
          {uploading ? "Enregistrement..." : "Continuer"}
        </button>
      </div>
    </main>
  );
}
