import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

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

    const verificationSession =
      await stripe.identity.verificationSessions.create({
        verification_flow: process.env.STRIPE_IDENTITY_FLOW_ID,

        client_reference_id: String(orderId),

        return_url:
          "https://mt-location-mini-app.vercel.app/contrat",
      });

    if (!verificationSession.url) {
      return Response.json(
        { error: "Stripe n'a pas retourné de lien de vérification." },
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
          "Impossible de créer la vérification d'identité.",
      },
      { status: 500 }
    );
  }
}
