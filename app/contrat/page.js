"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Contrat() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [reservationId, setReservationId] = useState("");
  const [customerId, setCustomerId] = useState("");

  const [contractSent, setContractSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [checking, setChecking] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const stored = sessionStorage.getItem("mtReservation");

    if (stored) {
      try {
        const data = JSON.parse(stored);

        setEmail(data?.customer?.email || "");
        setReservationId(data?.reservation?.id || "");
        setCustomerId(data?.customer?.id || "");
      } catch {
        setEmail("");
      }
    }
  }, []);

  async function handleSendContract() {
    try {
      setSending(true);
      setMessage("");

      const response = await fetch("/api/booqable/contrat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          orderId: reservationId,
          customerId,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        alert(
          result.message || "Erreur lors de l'envoi du contrat."
        );
        return;
      }

      setContractSent(true);
      setMessage("");
    } catch (error) {
      alert("Erreur lors de l'envoi du contrat.");
    } finally {
      setSending(false);
    }
  }

  async function handleCheckContract() {
    try {
      setChecking(true);
      setMessage("Vérification du contrat...");

      const response = await fetch("/api/check-contract", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId: reservationId,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        setMessage(
          result.message || "Impossible de vérifier le contrat."
        );
        return;
      }

      if (result.signed === true) {
        setMessage("Contrat signé avec succès.");

        setTimeout(() => {
          router.push("/inspection-depart");
        }, 500);

        return;
      }

      setMessage(
        "Votre contrat n'est pas encore signé. Signez-le dans votre courriel puis réessayez."
      );
    } catch (error) {
      setMessage("Impossible de vérifier le contrat.");
    } finally {
      setChecking(false);
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
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "16px 20px",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "430px",
          textAlign: "center",
        }}
      >
        <img
          src="/logo-mt.PNG"
          alt="MT Location Remorques"
          style={{
            width: "260px",
            maxWidth: "85%",
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
          Recevoir le contrat
        </h1>

        <p
          style={{
            color: "#aaaaaa",
            fontSize: "16px",
            lineHeight: "1.4",
            margin: "0 0 22px",
          }}
        >
          Votre identité a été vérifiée avec succès.
          <br />
          Votre contrat sera envoyé par courriel.
        </p>

        <div
          style={{
            background: "#151515",
            border: "1px solid #444444",
            borderRadius: "18px",
            padding: "20px",
            textAlign: "left",
          }}
        >
          {!contractSent && (
            <>
              <label
                style={{
                  display: "block",
                  fontSize: "15px",
                  fontWeight: "700",
                  marginBottom: "8px",
                }}
              >
                Courriel
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre@email.com"
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  padding: "15px",
                  borderRadius: "10px",
                  border: "1px solid #444444",
                  background: "#0b0b0b",
                  color: "#ffffff",
                  fontSize: "16px",
                  marginBottom: "16px",
                }}
              />

              <button
                type="button"
                onClick={handleSendContract}
                disabled={sending}
                style={{
                  width: "100%",
                  padding: "16px",
                  border: "1px solid #666666",
                  borderRadius: "12px",
                  background: "#0b0b0b",
                  color: "#ffffff",
                  fontSize: "17px",
                  fontWeight: "700",
                  cursor: sending ? "default" : "pointer",
                  opacity: sending ? 0.6 : 1,
                }}
              >
                {sending
                  ? "Envoi en cours..."
                  : "Envoyer mon contrat"}
              </button>
            </>
          )}

       {contractSent && (
  <div
    style={{
      width: "100%",
      boxSizing: "border-box",
      textAlign: "center",
    }}
  >
    <div
      style={{
        width: "100%",
        textAlign: "center",
        fontSize: "40px",
        marginBottom: "10px",
      }}
    >
      ✓
    </div>

    <h2
      style={{
        width: "100%",
        textAlign: "center",
        fontSize: "21px",
        margin: "0 0 10px",
      }}
    >
      Contrat envoyé
    </h2>

    <div
      style={{
        width: "100%",
        textAlign: "center",
        marginBottom: "18px",
      }}
    >
      <p
        style={{
          color: "#aaaaaa",
          fontSize: "15px",
          lineHeight: "1.5",
          margin: "0",
          textAlign: "center",
        }}
      >
        Consultez votre courriel et signez votre contrat.
        <br />
        Revenez ensuite ici pour poursuivre.
      </p>
    </div>

    <div
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <button
        type="button"
        onClick={handleCheckContract}
        disabled={checking}
        style={{
          width: "90%",
          margin: "0 auto",
          padding: "16px",
          border: "1px solid #666666",
          borderRadius: "12px",
          background: "#0b0b0b",
          color: "#ffffff",
          fontSize: "17px",
          fontWeight: "700",
          cursor: checking ? "default" : "pointer",
          opacity: checking ? 0.6 : 1,
          textAlign: "center",
          boxSizing: "border-box",
        }}
      >
        {checking
          ? "Vérification..."
          : "Vérifier mon contrat et continuer"}
      </button>
    </div>

    {message && (
      <p
        style={{
          width: "100%",
          margin: "16px 0 0",
          color: "#cccccc",
          fontSize: "14px",
          lineHeight: "1.4",
          textAlign: "center",
        }}
      >
        {message}
      </p>
    )}
  </div>
)}
        </div>
      </div>
    </main>
  );
}
