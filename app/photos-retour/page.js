"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProgressionRetour from "../components/ProgressionRetour";

export default function PhotosRetour() {
  const router = useRouter();

  const [etatRetour, setEtatRetour] = useState("");
  const [confirmation, setConfirmation] = useState(false);

  const [dommage, setDommage] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [erreur, setErreur] = useState("");

  useEffect(() => {
    const etat = sessionStorage.getItem("mtEtatRetour");
    setEtatRetour(etat || "");
  }, []);

  async function compressImage(file) {
    return new Promise((resolve, reject) => {
      const imageUrl = URL.createObjectURL(file);
      const img = new Image();

      img.onload = () => {
        try {
          const MAX_SIZE = 1800;

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
                reject(new Error("Impossible de préparer la photo."));
                return;
              }

              resolve(
                new File([blob], `dommage-${Date.now()}.jpg`, {
                  type: "image/jpeg",
                  lastModified: Date.now(),
                })
              );
            },
            "image/jpeg",
            0.82
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

  async function handleDommageChange(file) {
    if (!file) return;

    try {
      setErreur("");
      setProcessing(true);

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
      setErreur(
        err?.message ||
          "Impossible de préparer la photo du dommage. Veuillez la reprendre."
      );
    } finally {
      setProcessing(false);
    }
  }

  async function uploadDommage(orderId) {
    const formData = new FormData();

    formData.append("file", dommage.file);
    formData.append("orderId", orderId);
    formData.append("category", "inspection-retour");
    formData.append("photoType", "dommage");

    const response = await fetch("/api/photos/upload", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(
        data.error || "Impossible d'enregistrer la photo du dommage."
      );
    }
  }

  async function continuer() {
    if (!confirmation) {
      setErreur(
        "Veuillez confirmer que vous avez pris et conservé les 5 photos de retour."
      );
      return;
    }

    if (etatRetour === "dommage" && !dommage) {
      setErreur("Veuillez ajouter une photo du dommage.");
      return;
    }

    try {
      setErreur("");

      if (etatRetour === "dommage") {
        setUploading(true);

        const stored = sessionStorage.getItem("mtReservation");

        if (!stored) {
          throw new Error("Réservation introuvable.");
        }

        const reservationData = JSON.parse(stored);
        const orderId = reservationData?.reservation?.id;

        if (!orderId) {
          throw new Error("Numéro de réservation introuvable.");
        }

        await uploadDommage(orderId);
      }

      router.push("/retour-termine");
    } catch (err) {
      setErreur(
        err?.message ||
          "Impossible de finaliser le retour. Veuillez réessayer."
      );
      setUploading(false);
    }
  }

  const peutContinuer =
    confirmation &&
    !processing &&
    !uploading &&
    (etatRetour !== "dommage" || dommage);

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
            lineHeight: "1.5",
          }}
        >
          Avant de quitter, prenez les 5 photos suivantes avec votre téléphone.
        </p>

        <div
          style={{
            width: "100%",
            background: "#151515",
            border: "1px solid #444444",
            borderRadius: "14px",
            padding: "18px",
            marginBottom: "12px",
            boxSizing: "border-box",
            textAlign: "left",
          }}
        >
          <div style={{ marginBottom: "12px", fontWeight: "700" }}>
            Photos à prendre :
          </div>

          <div style={{ lineHeight: "1.9", color: "#dddddd" }}>
            1. Avant de la remorque
            <br />
            2. Arrière de la remorque
            <br />
            3. Côté conducteur
            <br />
            4. Côté passager
            <br />
            5. Intérieur
          </div>
        </div>

        <div
          style={{
            background: "#151515",
            border: "1px solid #555555",
            borderRadius: "14px",
            padding: "16px",
            marginBottom: "14px",
            textAlign: "left",
          }}
        >
          <strong style={{ display: "block", marginBottom: "8px" }}>
            Conservez vos photos
          </strong>

          <div
            style={{
              color: "#bbbbbb",
              fontSize: "14px",
              lineHeight: "1.5",
            }}
          >
            Gardez-les sur votre téléphone jusqu’à la fermeture complète de la
            location. Elles pourront servir à confirmer l’état de la remorque
            lors du retour.
          </div>
        </div>

        <label
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: "12px",
            textAlign: "left",
            background: "#151515",
            border: "1px solid #444444",
            borderRadius: "14px",
            padding: "16px",
            cursor: "pointer",
            marginBottom: "14px",
          }}
        >
          <input
            type="checkbox"
            checked={confirmation}
            onChange={(e) => {
              setConfirmation(e.target.checked);
              setErreur("");
            }}
            style={{
              width: "22px",
              height: "22px",
              marginTop: "1px",
              flexShrink: 0,
            }}
          />

          <span
            style={{
              fontSize: "15px",
              lineHeight: "1.45",
            }}
          >
            Je confirme avoir pris les 5 photos demandées et les avoir
            conservées sur mon téléphone.
          </span>
        </label>

        {etatRetour === "dommage" && (
          <div
            style={{
              width: "100%",
              background: "#151515",
              border: "1px solid #aa5555",
              borderRadius: "14px",
              padding: "14px",
              marginBottom: "14px",
              boxSizing: "border-box",
              textAlign: "center",
            }}
          >
            <strong>PHOTO DU DOMMAGE</strong>

            <p
              style={{
                color: "#bbbbbb",
                fontSize: "14px",
                lineHeight: "1.4",
                margin: "8px 0 12px",
              }}
            >
              Cette photo sera transmise à MT Location Remorques.
            </p>

            {dommage?.preview && (
              <img
                src={dommage.preview}
                alt="Dommage"
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
                border: "1px solid #aa5555",
                borderRadius: "10px",
                background: "#0b0b0b",
                cursor: processing || uploading ? "default" : "pointer",
                opacity: processing || uploading ? 0.6 : 1,
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
                {processing
                  ? "Préparation..."
                  : dommage
                  ? "Reprendre"
                  : "Photo du dommage"}
              </span>

              <input
                type="file"
                accept="image/*"
                capture="environment"
                disabled={processing || uploading}
                onChange={(e) => {
                  const file = e.target.files?.[0];

                  if (file) {
                    handleDommageChange(file);
                  }

                  e.target.value = "";
                }}
                style={{ display: "none" }}
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
          disabled={!peutContinuer}
          style={{
            width: "100%",
            minHeight: "58px",
            background: peutContinuer ? "#f2c94c" : "#444444",
            color: peutContinuer ? "#111111" : "#888888",
            border: "none",
            borderRadius: "16px",
            fontSize: "18px",
            fontWeight: "700",
            cursor: peutContinuer ? "pointer" : "default",
          }}
        >
          {uploading ? "Enregistrement du dommage..." : "Finaliser le retour"}
        </button>
      </div>
    </main>
  );
}
