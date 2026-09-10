"use client";

import { useState } from "react";
import ProgressionEtapes from "../components/ProgressionEtapes";

export default function InspectionDepart() {
  const [photos, setPhotos] = useState({
    avant: null,
    arriere: null,
    conducteur: null,
    passager: null,
    interieur: null,
  });

  const [processing, setProcessing] = useState({
    avant: false,
    arriere: false,
    conducteur: false,
    passager: false,
    interieur: false,
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

  /*
   * Compresse automatiquement une photo avant son envoi.
   *
   * - Maximum 1600 px
   * - JPEG qualité 0.78
   * - Suffisant pour documenter l'état de la remorque
   * - Beaucoup plus rapide à téléverser
   */
  async function compressImage(file) {
    return new Promise((resolve, reject) => {
      const imageUrl = URL.createObjectURL(file);
      const img = new Image();

      img.onload = () => {
        try {
          const MAX_SIZE = 1600;

          let width = img.width;
          let height = img.height;

          if (width > height && width > MAX_SIZE) {
            height = Math.round((height * MAX_SIZE) / width);
            width = MAX_SIZE;
          } else if (height >= width && height > MAX_SIZE) {
            width = Math.round((width * MAX_SIZE) / height);
            height = MAX_SIZE;
          }

          const canvas = document.createElement("canvas");

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext("2d");

          if (!ctx) {
            URL.revokeObjectURL(imageUrl);
            reject(new Error("Impossible de traiter la photo."));
            return;
          }

          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              URL.revokeObjectURL(imageUrl);

              if (!blob) {
                reject(new Error("Impossible de compresser la photo."));
                return;
              }

              const compressedFile = new File(
                [blob],
                `${Date.now()}.jpg`,
                {
                  type: "image/jpeg",
                  lastModified: Date.now(),
                }
              );

              resolve(compressedFile);
            },
            "image/jpeg",
            0.78
          );
        } catch (err) {
          URL.revokeObjectURL(imageUrl);
          reject(err);
        }
      };

      img.onerror = () => {
        URL.revokeObjectURL(imageUrl);
        reject(new Error("Impossible de lire cette photo."));
      };

      img.src = imageUrl;
    });
  }

  async function handlePhotoChange(key, file) {
    if (!file) return;

    try {
      setError("");

      setProcessing((prev) => ({
        ...prev,
        [key]: true,
      }));

      /*
       * La compression commence immédiatement
       * pendant que le client passe à la photo suivante.
       */
      const compressedFile = await compressImage(file);

      setPhotos((prev) => {
        if (prev[key]?.preview) {
          URL.revokeObjectURL(prev[key].preview);
        }

        return {
          ...prev,
          [key]: {
            file: compressedFile,
            preview: URL.createObjectURL(compressedFile),
          },
        };
      });
    } catch (err) {
      console.error("Erreur compression :", err);

      setError(
        err?.message ||
          "Impossible de préparer cette photo. Veuillez la reprendre."
      );
    } finally {
      setProcessing((prev) => ({
        ...prev,
        [key]: false,
      }));
    }
  }

  const allPhotosTaken = Object.values(photos).every(Boolean);

  const photoBeingProcessed = Object.values(processing).some(Boolean);

  async function uploadPhoto(photoType, photoData, orderId) {
    const formData = new FormData();

    formData.append("file", photoData.file);
    formData.append("orderId", orderId);
    formData.append("category", "inspection-depart");
    formData.append("photoType", photoType);

    const response = await fetch("/api/photos/upload", {
      method: "POST",
      body: formData,
    });

    let data;

    try {
      data = await response.json();
    } catch {
      throw new Error(
        `Erreur lors de l'enregistrement de la photo ${photoLabels[photoType]}.`
      );
    }

    if (!response.ok || !data.success) {
      throw new Error(
        data.error ||
          `Erreur lors de l'enregistrement de la photo ${photoLabels[photoType]}.`
      );
    }

    return data;
  }

  async function handleContinue() {
    if (
      !allPhotosTaken ||
      uploading ||
      photoBeingProcessed
    ) {
      return;
    }

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

      /*
       * Les 5 photos compressées sont envoyées
       * SIMULTANÉMENT.
       */
      await Promise.all(
        Object.entries(photos).map(([photoType, photoData]) =>
          uploadPhoto(photoType, photoData, orderId)
        )
      );

      /*
       * On ne montre le code d'accès que lorsque
       * les 5 photos sont réellement enregistrées.
       */
      window.location.href = "/code-acces";
    } catch (err) {
      console.error("Erreur inspection départ :", err);

      setError(
        err?.message ||
          "Impossible d'enregistrer les photos. Veuillez réessayer."
      );

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
        <ProgressionEtapes etape={4} />

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
                  cursor:
                    uploading || processing[key]
                      ? "default"
                      : "pointer",
                  fontWeight: "700",
                  opacity:
                    uploading || processing[key]
                      ? 0.6
                      : 1,
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
                  {processing[key]
                    ? "Préparation..."
                    : photos[key]
                    ? "Reprendre"
                    : "Photo"}
                </span>

                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  disabled={
                    uploading || processing[key]
                  }
                  onChange={(e) => {
                    const file = e.target.files?.[0];

                    if (file) {
                      handlePhotoChange(key, file);
                    }

                    e.target.value = "";
                  }}
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
          disabled={
            !allPhotosTaken ||
            uploading ||
            photoBeingProcessed
          }
          style={{
            width: "100%",
            marginTop: "20px",
            padding: "16px",
            border: "1px solid #666666",
            borderRadius: "12px",
            background:
              allPhotosTaken &&
              !uploading &&
              !photoBeingProcessed
                ? "#0b0b0b"
                : "#222222",
            color:
              allPhotosTaken &&
              !uploading &&
              !photoBeingProcessed
                ? "#ffffff"
                : "#777777",
            fontSize: "17px",
            fontWeight: "700",
            cursor:
              allPhotosTaken &&
              !uploading &&
              !photoBeingProcessed
                ? "pointer"
                : "default",
          }}
        >
          {uploading
            ? "Enregistrement..."
            : photoBeingProcessed
            ? "Préparation..."
            : "Continuer"}
        </button>

        {uploading && (
          <p
            style={{
              color: "#aaaaaa",
              fontSize: "13px",
              margin: "10px 0 0",
            }}
          >
            Finalisation des photos...
          </p>
        )}
      </div>
    </main>
  );
}
