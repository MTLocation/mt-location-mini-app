export async function POST(request) {
  try {
    const body = await request.json();

    const orderId = body.orderId;
    const pin = body.pin;
    const pinId = body.pinId;

    if (!orderId || !pin) {
      return Response.json(
        { error: "orderId ou PIN manquant." },
        { status: 400 }
      );
    }

    return Response.json({
      success: true,
      orderId,
      pin,
      pinId,
    });
  } catch (error) {
    return Response.json(
      {
        error: "Erreur serveur.",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
