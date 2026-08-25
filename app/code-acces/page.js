"use client";

import { useEffect, useState } from "react";

export default function CodeAccesPage() {
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function getPin() {
      try {
        const response = await fetch("/api/igloohome");
        const data = await response.json();

        if (!response.ok || !data.pin) {
          throw new Error(
            data.error || "Impossible d'obtenir le code."
          );
        }

        // On garde seulement les chiffres du code Igloohome
        setPin(String(data.pin).replace(/\D/g, ""));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    getPin();
  }, []);

  async function handleCopyPin() {
    try {
      await navigator.clipboard.writeText(pin);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      setError("Impossible de copier le code.");
    }
  }

  return (
    <>
      <style>{`
        * {
          box-sizing: border-box;
        }

        html,
        body {
          margin: 0;
          padding: 0;
          background: #080808;
        }

        .code-page {
          min-height: 100vh;
          width: 100%;
          background: #080808;
          color: #ffffff;
          font-family: Arial, sans-serif;

          display: flex;
          justify-content: flex-start;
          align-items: center;

          padding: 8px 18px 24px;
        }

        .code-wrapper {
          width: 100%;
          max-width: 430px;
          margin: 0 auto;
          text-align: center;
        }

        .logo {
          display: block;
          width: 190px;
          max-width: 65%;
          height: auto;
          object-fit: contain;
          margin: 0 auto 18px;
        }

        .title {
          margin: 0 0 10px;
          font-size: 30px;
          line-height: 1.1;
          font-weight: 800;
        }

        .subtitle {
          margin: 0 0 20px;
          color: #bcbcbc;
          font-size: 16px;
          line-height: 1.35;
        }

        .pin-box {
          width: 100%;
          min-height: 125px;

          display: flex;
          align-items: center;
          justify-content: center;

          background: #151515;
          border: 1px solid #555555;
          border-radius: 18px;

          padding: 20px 12px;
        }

        .loading {
          font-size: 16px;
          color: #aaaaaa;
        }

        .error {
          font-size: 15px;
          line-height: 1.4;
          color: #aaaaaa;
        }

        .pin {
          width: 100%;
          text-align: center;
          white-space: nowrap;

          font-size: clamp(27px, 8vw, 38px);
          line-height: 1;
          font-weight: 800;
          letter-spacing: 2px;
        }

        .copy-button {
          width: 100%;
          margin-top: 12px;

          padding: 14px 12px;

          background: #0b0b0b;
          border: 1px solid #666666;
          border-radius: 12px;

          color: #ffffff;
          font-size: 16px;
          font-weight: 700;

          cursor: pointer;
        }

        .copy-button:disabled {
          opacity: 0.5;
          cursor: default;
        }

        .notice {
          margin: 18px auto 0;
          max-width: 390px;

          color: #bcbcbc;
          font-size: 14px;
          line-height: 1.4;
        }

        .good-road {
          margin: 22px 0 0;
          font-size: 26px;
          line-height: 1.1;
          font-weight: 800;
        }

        .company {
          margin: 8px 0 0;
          color: #bcbcbc;
          font-size: 13px;
          font-weight: 600;
        }

        @media (max-width: 480px) {
          .code-page {
            min-height: 100svh;
            padding: 6px 16px 18px;
          }

          .code-wrapper {
            max-width: 390px;
          }

          .logo {
            width: 165px;
            margin-bottom: 14px;
          }

          .title {
            font-size: 26px;
            margin-bottom: 8px;
          }

          .subtitle {
            font-size: 14px;
            margin-bottom: 16px;
          }

          .pin-box {
            min-height: 105px;
            padding: 16px 10px;
            border-radius: 16px;
          }

          .pin {
            font-size: 30px;
            letter-spacing: 1px;
          }

          .copy-button {
            margin-top: 10px;
            padding: 12px 10px;
            font-size: 15px;
          }

          .notice {
            margin-top: 15px;
            font-size: 13px;
            line-height: 1.35;
          }

          .good-road {
            margin-top: 18px;
            font-size: 24px;
          }

          .company {
            margin-top: 6px;
            font-size: 12px;
          }
        }
      `}</style>

      <main className="code-page">
        <div className="code-wrapper">

          <img
            src="/logo-mt.PNG"
            alt="MT Location Remorques"
            className="logo"
          />

          <h1 className="title">
            Votre code d’accès
          </h1>

          <p className="subtitle">
            Utilisez ce code pour déverrouiller la remorque.
          </p>

          <div className="pin-box">
            {loading && (
              <div className="loading">
                Génération du code...
              </div>
            )}

            {!loading && error && (
              <div className="error">
                {error}
              </div>
            )}

            {!loading && !error && (
              <div className="pin">
                {pin}
              </div>
            )}
          </div>

          {!loading && !error && (
            <button
              type="button"
              onClick={handleCopyPin}
              disabled={!pin}
              className="copy-button"
            >
              {copied ? "Code copié ✓" : "Copier le code"}
            </button>
          )}

          <p className="notice">
            Votre code restera valide jusqu’à 30 minutes après
            l’heure prévue de votre retour.
            <br />
            Veuillez nous aviser à l’avance de tout retard potentiel.
          </p>

          <h2 className="good-road">
            Bonne route!
          </h2>

          <p className="company">
            MT Location Remorques
          </p>

        </div>
      </main>
    </>
  );
}
