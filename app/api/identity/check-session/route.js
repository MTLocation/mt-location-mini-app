export async function POST(request) {
  try {
    const body = await request.json();

    const { sessionId, orderId } = body;

    if (!sessionId) {
      return Response.json(
        { error: "Session de vérification introuvable." },
        { status: 400 }
      );
    }

    if (!orderId) {
      return Response.json(
        { error: "Réservation introuvable." },
        { status: 400 }
      );
    }

    const secretKey = process.env.STRIPE_SECRET_KEY;

    if (!secretKey) {
      return Response.json(
        { error: "Clé Stripe non configurée." },
        { status: 500 }
      );
    }

    const stripeResponse = await fetch(
      `https://api.stripe.com/v1/identity/verification_sessions/${encodeURIComponent(
        sessionId
      )}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${secretKey}`,
        },
        cache: "no-store",
      }
    );

    const session = await stripeResponse.json();

    if (!stripeResponse.ok) {
      console.error("Erreur Stripe Identity :", session);

      return Response.json(
        {
          error:
            session?.error?.message ||
            "Impossible de vérifier l'identité.",
        },
        { status: 500 }
      );
    }

    // Sécurité :
    // la vérification Stripe doit appartenir
    // à la réservation actuellement ouverte.
    if (
      session.client_reference_id &&
      String(session.client_reference_id) !== String(orderId)
    ) {
      return Response.json(
        {
          error:
            "Cette vérification ne correspond pas à la réservation.",
        },
        { status: 403 }
      );
    }

    return Response.json({
      success: true,
      status: session.status,
      verified: session.status === "verified",
      retryUrl:
        session.status === "requires_input"
          ? session.url || null
          : null,
    });
  } catch (error) {
    console.error(
      "Erreur vérification Stripe Identity :",
      error
    );

    return Response.json(
      {
        error:
          error?.message ||
          "Impossible de vérifier le résultat.",
      },
      { status: 500 }
    );
  }
}
