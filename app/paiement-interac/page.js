"use client";

import { useEffect, useState } from "react";
import ProgressionEtapes from "../components/ProgressionEtapes";

export default function PaiementInterac() {
  const [data, setData] = useState(null);
  const [paymentReceived, setPaymentReceived] = useState(false);
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem("mtReservation");

    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setData(parsed);

        const initialStatus = getPropertyValue(
          parsed?.reservation?.properties,
          "interac_payment_status"
        );

        if (initialStatus === "paid") {
          setPaymentReceived(true);
        }
      } catch {
        setData(null);
      }
    }
  }, []);

  function getPropertyValue(properties, identifier) {
    if (!properties) return null;

    if (Array.isArray(properties)) {
      const property = properties.find((item) => {
        const id =
          item?.identifier ||
          item?.attributes?.identifier;

        return id === identifier;
      });

      return (
        property?.value ||
        property?.attributes?.value ||
        null
      );
    }

    return (
      properties?.[identifier]?.value ||
      properties?.[identifier] ||
      null
    );
  }

  useEffect(() => {
    if (!data?.customer?.email || paymentReceived) return;

    let cancelled = false;

    async function checkPayment() {
      try {
        setChecking(true);

        const response = await fetch(
          "/api/booqable/reservation",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: data.customer.email,
            }),
            cache: "no-store",
          }
        );

        if (!response.ok) return;

        const freshData = await response.json();

        if (
          !freshData?.success ||
          !freshData?.reservation
        ) {
          return;
        }

        sessionStorage.setItem(
          "mtReservation",
          JSON.stringify(freshData)
        );

        if (!cancelled) {
          setData(freshData);

          const status = getPropertyValue(
            freshData.reservation.properties,
            "interac_payment_status"
          );

          if (status === "paid") {
            setPaymentReceived(true);
          }
        }
      } catch (error) {
        console.error(
          "Erreur vérification paiement:",
          error
        );
      } finally {
        if (!cancelled) {
          setChecking(false);
        }
      }
    }

    checkPayment();

    const interval = setInterval(
      checkPayment,
      5000
    );

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [data?.customer?.email, paymentReceived]);

  if (!data) {
    return (
      <main
        style={{
          minHeight: "100dvh",
          background: "#0b0b0b",
          color: "#ffffff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "Arial, sans-serif",
          padding: "20px",
          boxSizing: "border-box",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <h1>Réservation introuvable</h1>

          <p style={{ color: "#aaaaaa" }}>
            Veuillez recommencer la recherche.
          </p>
        </div>
      </main>
    );
  }

  const reservation = data.reservation || {};

  const totalToBePaidInCents = Number(
    reservation.totalToBePaidInCents || 0
  );

  const amount = (
    totalToBePaidInCents / 100
  ).toLocaleString("fr-CA", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const reference = `MT-${reservation.number}`;

  return (
    <main
      style={{
        minHeight: "100dvh",
        width: "100%",
        overflowY: "auto",
        WebkitOverflowScrolling: "touch",
        background: "#0b0b0b",
        color: "#ffffff",
        fontFamily: "Arial, sans-serif",
        padding:
          "20px 20px calc(120px + env(safe-area-inset-bottom))",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "430px",
          margin: "0 auto",
        }}
      >
        <ProgressionEtapes etape={1} />

        <img
          src="/logo-mt.PNG"
          alt="MT Location Remorques"
          style={{
            width: "200px",
            maxWidth: "90%",
            height: "auto",
            display: "block",
            margin: "10px auto 20px",
          }}
        />

        <h1
          style={{
            fontSize: "28px",
            textAlign: "center",
            margin: "0 0 8px",
          }}
        >
          Paiement Interac
        </h1>

        <p
          style={{
            color: "#aaaaaa",
            textAlign: "center",
            margin: "0 0 20px",
          }}
        >
          Effectuez votre virement pour poursuivre
          la prise de possession.
        </p>

        <div
          style={{
            background: "#151515",
            border: "1px solid #333333",
            borderRadius: "18px",
            padding: "20px",
          }}
        >
          <div
            style={{
              marginBottom: "22px",
              textAlign: "center",
            }}
          >
            <div
              style={{
                color: "#aaaaaa",
                fontSize: "14px",
                marginBottom: "4px",
              }}
            >
              Montant à envoyer
            </div>

            <div
              style={{
                fontSize: "36px",
                fontWeight: "700",
                color: "#ff6b00",
              }}
            >
              {amount} $
            </div>
          </div>
<div
  style={{
    marginTop: "10px",
    color: "#aaaaaa",
    fontSize: "14px",
    lineHeight: "1.45",
  }}
>
  Ce montant comprend un dépôt de sécurité de 250,00 $.
  Ce dépôt vous sera remboursé après le retour de la remorque,
  sous réserve qu’aucun dommage, frais ou montant additionnel
  ne soit applicable.
</div>
          <div style={{ marginBottom: "20px" }}>
            <div
              style={{
                color: "#aaaaaa",
                fontSize: "14px",
                marginBottom: "4px",
              }}
            >
              Envoyer le virement à
            </div>

            <div
              style={{
                fontSize: "18px",
                fontWeight: "700",
                wordBreak: "break-word",
              }}
            >
              info@mtlocationremorques.ca
            </div>
          </div>

          <div style={{ marginBottom: "20px" }}>
            <div
              style={{
                color: "#aaaaaa",
                fontSize: "14px",
                marginBottom: "4px",
              }}
            >
              Message du virement
            </div>

            <div
              style={{
                fontSize: "28px",
                fontWeight: "700",
              }}
            >
              {reference}
            </div>

            <div
              style={{
                color: "#aaaaaa",
                fontSize: "14px",
                marginTop: "8px",
                lineHeight: "1.4",
              }}
            >
              Inscrivez exactement cette référence
              dans le message du virement Interac.
              Elle permet d’associer automatiquement
              votre paiement à votre réservation.
            </div>
          </div>

          <div
            style={{
              borderTop: "1px solid #333333",
              paddingTop: "18px",
              textAlign: "center",
            }}
          >
            {paymentReceived ? (
              <>
                <div
                  style={{
                    fontSize: "22px",
                    fontWeight: "700",
                    marginBottom: "8px",
                  }}
                >
                  ✓ Paiement reçu
                </div>

                <div
                  style={{
                    color: "#aaaaaa",
                    fontSize: "14px",
                    marginBottom: "16px",
                  }}
                >
                  Votre paiement a été confirmé.
                </div>

                <button
                  type="button"
                  onClick={() =>
                    (window.location.href =
                      "/verification-identite")
                  }
                  style={{
                    width: "100%",
                    padding: "17px",
                    border: "1px solid #666666",
                    borderRadius: "12px",
                    background: "#000000",
                    color: "#ffffff",
                    fontSize: "17px",
                    fontWeight: "700",
                    cursor: "pointer",
                  }}
                >
                  Continuer
                </button>
              </>
            ) : (
              <>
                <div
                  style={{
                    fontSize: "18px",
                    fontWeight: "700",
                    marginBottom: "6px",
                  }}
                >
                  En attente du paiement
                </div>

                <div
                  style={{
                    color: "#aaaaaa",
                    fontSize: "14px",
                    lineHeight: "1.4",
                  }}
                >
                  {checking
                    ? "Vérification du paiement..."
                    : "Cette page vérifie automatiquement votre paiement."}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
