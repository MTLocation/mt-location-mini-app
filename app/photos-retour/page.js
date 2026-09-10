"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProgressionRetour from "../components/ProgressionRetour";

export default function PhotosRetour() {
  const router = useRouter();

  const [etatRetour, setEtatRetour] = useState("");

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
    dommage: false,
  });

  const [dommage, setDommage] = useState(null);

  const [uploading, setUploading] = useState(false);
  const [erreur, setErreur] = useState("");

  useEffect(() => {
    const etat = sessionStorage.getItem("mtEtatRetour");
    setEtatRetour(etat || "");
  }, []);

  const photoLabels = {
    avant: "AVANT",
    arriere: "ARRIÈRE",
    conducteur: "CÔTÉ CONDUCTEUR",
    passager: "CÔTÉ PASSAGER",
    interieur: "INTÉRIEUR",
  };

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
      setErreur("");

      setProcessing((prev) => ({
        ...prev,
        [key]: true,
      }));

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

      setErreur(
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

  async function handleDommageChange(file) {
    if (!file) return;

    try {
      setErreur("");

      setProcessing((prev) => ({
        ...prev,
        dommage: true,
      }));

      const compressedFile = await compressImage(file);

      setDommage((prev) => {
        if (prev?.preview) {
          URL.revokeObjectURL(prev.preview);
        }

        return {
          file: compressedFile,
          preview: URL.createObjectURL(compressedFile),
        };
      });
    } catch (err) {
      console.error("Erreur compression dommage :", err);

      setErreur(
        err?.message ||
          "Impossible de préparer la photo du dommage."
      );
    } finally {
      setProcessing((prev) => ({
        ...prev,
        dommage: false,
      }));
    }
  }

  async function uploadPhoto(photoType, photoData, orderId) {
    const formData = new FormData();

    formData.append("file", photoData.file);
    formData.append("orderId", orderId);
    formData.append("category", "inspection-retour");
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
        `Erreur lors de l'enregistrement de la photo ${photoType}.`
      );
    }

    if (!response.ok || !data.success) {
      throw new Error(
        data.error ||
          `Erreur lors de l'enregistrement de la photo ${photoType}.`
      );
    }

    return data;
  }

  const photosCompletes = Object.values(photos).every(Boolean);

  const photoBeingProcessed =
    Object.values(processing).some(Boolean);

  async function continuer() {
    if (
      !photosCompletes ||
      uploading ||
      photoBeingProcessed
    ) {
      if (!photosCompletes) {
        setErreur("Veuillez ajouter les 5 photos de la remorque.");
      }

      return;
    }

    if (etatRetour === "dommage" && !dommage) {
      setErreur("Veuillez ajouter une photo du dommage.");
      return;
    }

    try {
      setUploading(true);
      setErreur("");

      const stored = sessionStorage.getItem("mtReservation");

      if (!stored) {
        throw new Error("Réservation introuvable.");
      }

      const reservationData = JSON.parse(stored);
      const orderId = reservationData?.reservation?.id;

      if (!orderId) {
        throw new Error("Numéro de réservation introuvable.");
      }

      const uploads = Object.entries(photos).map(
        ([photoType, photoData]) =>
          uploadPhoto(photoType, photoData, orderId)
      );

      if (etatRetour === "dommage" && dommage) {
        uploads.push(
          uploadPhoto("dommage", dommage, orderId)
        );
      }

      /*
       * Toutes les photos sont envoyées simultanément.
       */
      await Promise.all(uploads);

      router.push("/retour-termine");
    } catch (err) {
      console.error("Erreur photos retour :", err);

      setErreur(
        err?.message ||
          "Impossible d'enregistrer les photos. Veuillez réessayer."
      );

      setUploading(false);
    }
  }

  const blocPhoto = {
    width: "100%",
    background: "#151515",
    border: "1px solid #444444",
    borderRadius: "14px",
    padding: "14px",
    marginBottom: "10px",
    boxSizing: "border-box",
    textAlign: "center",
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        width: "100%",
        background: "#0b0b0b",
        color: "#ffffff",
        fontFamily: "Arial, sans-serif",
        padding: "18px 20px 40px",
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
        <ProgressionRetour etape={3} />

        <img
          src="/logo-mt.PNG"
          alt="MT Location Remorques"
          style={{
            width: "220px",
            maxWidth: "80%",
            height: "auto",
            display: "block",
            margin: "0 auto 10px",
          }}
        />

        <h1
          style={{
            margin: "0 0 4px",
            fontSize: "28px",
          }}
        >
          Photos de retour
        </h1>

        <p
          style={{
            color: "#aaaaaa",
            margin: "0 0 14px",
            fontSize: "15px",
          }}
        >
          Prenez les 5 photos suivantes avant de quitter.
        </p>

        {Object.entries(photoLabels).map(([key, label]) => (
          <div key={key} style={blocPhoto}>
            <strong>{label}</strong>

            {photos[key]?.preview && (
              <img
                src={photos[key].preview}
                alt={label}
                style={{
                  width: "100%",
                  maxHeight: "180px",
                  objectFit: "cover",
                  borderRadius: "10px",
                  marginTop: "10px",
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
                marginTop: "10px",
                border: "1px solid #666666",
                borderRadius: "10px",
                background: "#0b0b0b",
                cursor:
                  uploading || processing[key]
                    ? "default"
                    : "pointer",
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
                  fontWeight: "700",
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

        {etatRetour === "dommage" && (
          <div
            style={{
              ...blocPhoto,
              border: "1px solid #aa5555",
            }}
          >
            <strong>PHOTO DU DOMMAGE</strong>

            {dommage?.preview && (
              <img
                src={dommage.preview}
                alt="Dommage"
                style={{
                  width: "100%",
                  maxHeight: "180px",
                  objectFit: "cover",
                  borderRadius: "10px",
                  marginTop: "10px",
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
                marginTop: "10px",
                border: "1px solid #aa5555",
                borderRadius: "10px",
                background: "#0b0b0b",
                cursor:
                  uploading || processing.dommage
                    ? "default"
                    : "pointer",
                opacity:
                  uploading || processing.dommage
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
                  fontWeight: "700",
                  whiteSpace: "nowrap",
                }}
              >
                {processing.dommage
                  ? "Préparation..."
                  : dommage
                  ? "Reprendre"
                  : "Photo"}
              </span>

              <input
                type="file"
                accept="image/*"
                capture="environment"
                disabled={
                  uploading || processing.dommage
                }
                onChange={(e) => {
                  const file = e.target.files?.[0];

                  if (file) {
                    handleDommageChange(file);
                  }

                  e.target.value = "";
                }}
                style={{
                  display: "none",
                }}
              />
            </label>
          </div>
        )}

        {erreur && (
          <div
            style={{
              color: "#ff6b6b",
              fontSize: "14px",
              margin: "8px 0 12px",
            }}
          >
            {erreur}
          </div>
        )}

        <button
          type="button"
          onClick={continuer}
          disabled={
            !photosCompletes ||
            uploading ||
            photoBeingProcessed ||
            (etatRetour === "dommage" && !dommage)
          }
          style={{
            width: "100%",
            minHeight: "58px",
            background:
              photosCompletes &&
              !uploading &&
              !photoBeingProcessed &&
              (etatRetour !== "dommage" || dommage)
                ? "#f2c94c"
                : "#444444",
            color:
              photosCompletes &&
              !uploading &&
              !photoBeingProcessed &&
              (etatRetour !== "dommage" || dommage)
                ? "#111111"
                : "#888888",
            border: "none",
            borderRadius: "16px",
            fontSize: "18px",
            fontWeight: "700",
            cursor:
              photosCompletes &&
              !uploading &&
              !photoBeingProcessed &&
              (etatRetour !== "dommage" || dommage)
                ? "pointer"
                : "default",
          }}
        >
          {uploading
            ? "Enregistrement..."
            : photoBeingProcessed
            ? "Préparation..."
            : "Finaliser le retour"}
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
