async function savePin(request) {
  try {
    const body = await request.json();

    const orderId = body.orderId;
    const pin = body.pin;
    const pinId = body.pinId;

    if (!orderId || !pin || !pinId) {
      return Response.json(
        {
          success: false,
          error: "orderId, pin ou pinId manquant.",
        },
        { status: 400 }
      );
    }

    const apiKey = process.env.BOOQABLE_API_KEY;

    if (!apiKey) {
      return Response.json(
        {
          success: false,
          error: "Clé API Booqable manquante.",
        },
        { status: 500 }
      );
    }

    const url =
      `https://mt-location-remorques.booqable.com/api/4/orders/${orderId}`;

    const booqableResponse = await fetch(url, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        data: {
          id: orderId,
          type: "orders",
          attributes: {
            properties_attributes: [
              {
                identifier: "igloohome_pin",
                value: String(pin),
              },
              {
                identifier: "igloohome_pin_id",
                value: String(pinId),
              },
            ],
          },
        },
      }),
    });

    const responseText = await booqableResponse.text();

    let responseData;

    try {
      responseData = JSON.parse(responseText);
    } catch {
      responseData = responseText;
    }

    if (!booqableResponse.ok) {
      return Response.json(
        {
          success: false,
          error: "Impossible d'enregistrer le PIN dans Booqable.",
          details: responseData,
        },
        { status: booqableResponse.status }
      );
    }

    return Response.json({
      success: true,
      orderId,
      pin,
      pinId,
      message: "PIN enregistré dans Booqable.",
    });
  } catch (error) {
    return Response.json(
      {
        success: false,
        error: "Erreur serveur.",
        details: error.message,
      },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  return savePin(request);
}

export async function PUT(request) {
  return savePin(request);
}
