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
        .code-page {
          min-height: 100vh;
          width: 100%;
          background: #080808;
          color: #ffffff;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-start;
          box-sizing: border-box;
          padding: 8px 18px 24px;
          font-family: Arial, sans-serif;
        }

        .code-wrapper {
          width: 100%;
          max-width: 430px;
          text-align: center;
        }

        .code-logo {
          width: 180px;
          max-width: 62vw;
          height: auto;
          display: block;
          margin: 0 auto 12px;
        }

        .code-title {
          margin: 0 0 6px;
          font-size: 28px;
          line-height: 1.1;
        }

        .code-subtitle {
          margin: 0 0 16px;
          color: #aaaaaa;
          font-size: 15px;
          line-height: 1.35;
        }

        .pin-box {
          width: 100%;
          min-height: 120px;
          background: #151515;
          border: 1px solid #444444;
          border-radius: 18px;
          box-sizing: border-box;
          padding: 18px 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .pin-value {
          width: 100%;
          font-size: 30px;
          line-height: 1;
          font-weight: 700;
          letter-spacing: 1px;
          text-align: center;
          white-space: nowrap;
          word-break: normal;
          overflow-wrap: normal;
        }

        .copy-button {
          width: 100%;
          margin-top: 10px;
          padding: 13px;
          border: 1px solid #666666;
          border-radius: 12px;
          background: #0b0b0b;
          color: #ffffff;
          font-size: 15px;
          font-weight: 700;
          box-sizing: border-box;
        }

        .delay-text {
          width: 100%;
          margin: 14px 0 0;
          color: #aaaaaa;
          font-size: 13px;
          line-height: 1.4;
          text-align: center;
        }

        .good-road {
          margin-top: 18px;
          font-size: 25px;
          line-height: 1.1;
          font-weight: 700;
        }

        .brand {
          margin: 6px 0 0;
          color: #aaaaaa;
          font-size: 13px;
        }

        .status-text {
          font-size: 15px;
          color: #aaaaaa;
          line-height: 1.4;
        }

        @media (min-width: 700px) {
          .code-page {
            padding-top: 18px;
          }

          .code-logo {
            width: 220px;
            margin-bottom: 20px;
          }

          .code-title {
            font-size: 32px;
            margin-bottom: 10px;
          }

          .code-subtitle {
            font-size: 16px;
            margin-bottom: 20px;
          }

          .pin-box {
            min-height: 150px;
          }

          .pin-value {
            font-size: 34px;
          }

          .delay-text {
            font-size: 14px;
          }

          .good-road {
            font-size: 28px;
            margin-top: 24px;
          }
        }
      `}</style>

      <main className="code-page">
        <div className="code-wrapper">
          <img
            src="/logo-mt.PNG"
            alt="MT Location Remorques"
            className="code-logo"
          />

          <h1 className="code-title">
            Votre code d’accès
          </h1>

          <p className="code-subtitle">
            Utilisez ce code pour déverrouiller la remorque.
          </p>

          <div className="pin-box">
            {loading && (
              <div className="status-text">
                Génération du code...
              </div>
            )}

            {!loading && error && (
              <div className="status-text">
                {error}
              </div>
            )}

            {!loading && !error && (
              <div className="pin-value">
                {pin}
              </div>
            )}
          </div>

          {!loading && !error && (
            <>
              <button
                type="button"
                onClick={handleCopyPin}
                className="copy-button"
              >
                {copied ? "Code copié ✓" : "Copier le code"}
              </button>

              <p className="delay-text">
                Votre code restera valide jusqu’à 30 minutes après
                l’heure prévue de votre retour.
                <br />
                Veuillez nous aviser à l’avance de tout retard potentiel.
              </p>

              <div className="good-road">
                Bonne route!
              </div>

              <p className="brand">
                MT Location Remorques
              </p>
            </>
          )}
        </div>
      </main>
    </>
  );
}
