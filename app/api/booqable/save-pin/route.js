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

    const createProperty = async ({
      name,
      identifier,
      value,
    }) => {
      const response = await fetch(
        "https://mt-location-remorques.booqable.com/api/4/properties",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            data: {
              type: "properties",
              attributes: {
                name,
                identifier,
                property_type: "text_field",
                value: String(value),
                owner_id: orderId,
                owner_type: "orders",
              },
            },
          }),
        }
      );

      const text = await response.text();

      let data;

      try {
        data = JSON.parse(text);
      } catch {
        data = text;
      }

      if (!response.ok) {
        throw new Error(
          `${name}: ${
            typeof data === "string"
              ? data
              : JSON.stringify(data)
          }`
        );
      }

      return data;
    };

    const pinProperty = await createProperty({
      name: "Igloohome PIN",
      identifier: "igloohome_pin",
      value: pin,
    });

    const pinIdProperty = await createProperty({
      name: "Igloohome PIN ID",
      identifier: "igloohome_pin_id",
      value: pinId,
    });

    return Response.json({
      success: true,
      orderId,
      pin,
      pinId,
      message: "PIN enregistré dans Booqable.",
      pinPropertyId: pinProperty?.data?.id,
      pinIdPropertyId: pinIdProperty?.data?.id,
    });
  } catch (error) {
    return Response.json(
      {
        success: false,
        error: "Erreur lors de l'enregistrement du PIN.",
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
