export async function POST(request) {
  try {
    const body = await request.json();
    const { orderId } = body;

    if (!orderId) {
      return Response.json(
        { error: "Numéro de réservation manquant." },
        { status: 400 }
      );
    }

    const secretKey = process.env.STRIPE_SECRET_KEY;
    const flowId = process.env.STRIPE_IDENTITY_FLOW_ID;

    if (!secretKey) {
      return Response.json(
        { error: "Clé Stripe non configurée." },
        { status: 500 }
      );
    }

    if (!flowId) {
      return Response.json(
        { error: "Flux Stripe Identity non configuré." },
        { status: 500 }
      );
    }

    const params = new URLSearchParams();

    params.append("verification_flow", flowId);
    params.append("client_reference_id", String(orderId));
    params.append(
      "return_url",
      "https://mt-location-mini-app.vercel.app/contrat"
    );

    const stripeResponse = await fetch(
      "https://api.stripe.com/v1/identity/verification_sessions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${secretKey}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params.toString(),
      }
    );

    const verificationSession = await stripeResponse.json();

    if (!stripeResponse.ok) {
      console.error(
        "Erreur Stripe Identity :",
        verificationSession
      );

      return Response.json(
        {
          error:
            verificationSession?.error?.message ||
            "Impossible de créer la vérification d'identité.",
        },
        { status: 500 }
      );
    }

    if (!verificationSession.url) {
      return Response.json(
        {
          error:
            "Stripe n'a pas retourné de lien de vérification.",
        },
        { status: 500 }
      );
    }

    return Response.json({
      success: true,
      url: verificationSession.url,
      sessionId: verificationSession.id,
    });
  } catch (error) {
    console.error("Erreur Stripe Identity :", error);

    return Response.json(
      {
        error:
          error?.message ||
          "Impossible de démarrer la vérification d'identité.",
      },
      { status: 500 }
    );
  }
}
