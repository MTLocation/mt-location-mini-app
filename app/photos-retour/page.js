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
            margin: "0 auto 16px",
          }}
        />

        <h1
          style={{
            margin: "0 auto 10px",
            fontSize: "28px",
            textAlign: "center",
            width: "100%",
          }}
        >
          Photos de retour
        </h1>

        <p
          style={{
            color: "#aaaaaa",
            margin: "0 auto 18px",
            fontSize: "15px",
            lineHeight: "1.5",
            textAlign: "center",
            maxWidth: "380px",
          }}
        >
          Avant de quitter, prenez les 5 photos suivantes.
        </p>

        <div
          style={{
            width: "100%",
            background: "#151515",
            border: "1px solid #444444",
            borderRadius: "14px",
            padding: "24px 18px",
            margin: "0 auto 16px",
            boxSizing: "border-box",
            textAlign: "center",
          }}
        >
          <div
            style={{
              marginBottom: "18px",
              fontWeight: "700",
              fontSize: "18px",
              textAlign: "center",
            }}
          >
            Photos à prendre :
          </div>

          <div
            style={{
              lineHeight: "1.9",
              color: "#dddddd",
              fontSize: "15px",
              textAlign: "center",
            }}
          >
            Avant de la remorque
            <br />
            Arrière de la remorque
            <br />
            Côté conducteur
            <br />
            Côté passager
            <br />
            Intérieur
          </div>
        </div>

        <div
          style={{
            background: "#151515",
            border: "1px solid #555555",
            borderRadius: "14px",
            padding: "22px 18px",
            margin: "0 auto 16px",
            textAlign: "center",
          }}
        >
          <strong
            style={{
              display: "block",
              marginBottom: "12px",
              fontSize: "17px",
              textAlign: "center",
            }}
          >
            Conservez vos photos
          </strong>

          <div
            style={{
              color: "#bbbbbb",
              fontSize: "14px",
              lineHeight: "1.6",
              textAlign: "center",
              maxWidth: "360px",
              margin: "0 auto",
            }}
          >
            Gardez-les sur votre téléphone jusqu’à la fermeture complète de la
            location pour votre sécurité.
          </div>
        </div>

        <label
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "12px",
            background: "#151515",
            border: "1px solid #444444",
            borderRadius: "14px",
            padding: "20px",
            cursor: "pointer",
            margin: "0 auto 16px",
            textAlign: "center",
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
              margin: 0,
            }}
          />

          <span
            style={{
              fontSize: "15px",
              lineHeight: "1.5",
              textAlign: "center",
              maxWidth: "300px",
            }}
          >
            Je confirme avoir pris les 5 photos demandées.
          </span>
        </label>

        {etatRetour === "dommage" && (
          <div
            style={{
              width: "100%",
              background: "#151515",
              border: "1px solid #aa5555",
              borderRadius: "14px",
              padding: "18px",
              margin: "0 auto 16px",
              boxSizing: "border-box",
              textAlign: "center",
            }}
          >
            <strong
              style={{
                display: "block",
                textAlign: "center",
              }}
            >
              PHOTO DU DOMMAGE
            </strong>

            <p
              style={{
                color: "#bbbbbb",
                fontSize: "14px",
                lineHeight: "1.5",
                margin: "10px auto 14px",
                textAlign: "center",
                maxWidth: "340px",
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
                textAlign: "center",
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
                  textAlign: "center",
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
              lineHeight: "1.5",
              margin: "8px auto 14px",
              textAlign: "center",
              maxWidth: "360px",
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
            textAlign: "center",
            display: "block",
            margin: "0 auto",
          }}
        >
          {uploading ? "Enregistrement du dommage..." : "Finaliser le retour"}
        </button>
      </div>
    </main>
  );
}
