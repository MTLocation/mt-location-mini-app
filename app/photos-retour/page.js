"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProgressionEtapes from "../components/ProgressionEtapes";

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

  const [dommage, setDommage] = useState(null);
  const [erreur, setErreur] = useState("");

  useEffect(() => {
    const etat = sessionStorage.getItem("mtEtatRetour");
    setEtatRetour(etat || "");
  }, []);

  function handlePhotoChange(key, file) {
    if (!file) return;

    setPhotos((prev) => ({
      ...prev,
      [key]: file,
    }));
  }

  function continuer() {
    setErreur("");

    const photosCompletes =
      photos.avant &&
      photos.arriere &&
      photos.conducteur &&
      photos.passager &&
      photos.interieur;

    if (!photosCompletes) {
      setErreur("Veuillez ajouter les 5 photos de la remorque.");
      return;
    }

    if (etatRetour === "dommage" && !dommage) {
      setErreur("Veuillez ajouter une photo du dommage.");
      return;
    }

    router.push("/retour-termine");
  }

  const photoLabels = {
    avant: "AVANT",
    arriere: "ARRIÈRE",
    conducteur: "CÔTÉ CONDUCTEUR",
    passager: "CÔTÉ PASSAGER",
    interieur: "INTÉRIEUR",
  };

  const blocPhoto = {
    width: "100%",
    background: "#151515",
    border: "1px solid #444444",
    borderRadius: "14px",
    padding: "12px",
    marginBottom: "10px",
    boxSizing: "border-box",
    textAlign: "center",
  };

  const inputStyle = {
    width: "100%",
    marginTop: "8px",
    color: "#ffffff",
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        width: "100%",
        background: "#0b0b0b",
        color: "#ffffff",
        fontFamily: "Arial, sans-serif",
        padding: "18px 20px",
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

            <input
              type="file"
              accept="image/*"
              capture="environment"
              onChange={(e) =>
                handlePhotoChange(
                  key,
                  e.target.files?.[0] || null
                )
              }
              style={inputStyle}
            />
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

            <input
              type="file"
              accept="image/*"
              capture="environment"
              onChange={(e) =>
                setDommage(e.target.files?.[0] || null)
              }
              style={inputStyle}
            />
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
          style={{
            width: "100%",
            minHeight: "58px",
            background: "#f2c94c",
            color: "#111111",
            border: "none",
            borderRadius: "16px",
            fontSize: "18px",
            fontWeight: "700",
            cursor: "pointer",
          }}
        >
          Finaliser le retour
        </button>
      </div>
    </main>
  );
}
