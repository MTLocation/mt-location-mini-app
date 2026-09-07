async function saveInteracPayment(request) {
  try {
    const body = await request.json();

    const orderId = body.orderId;
    const amount = body.amount;
    const interacReference = body.interacReference;

    if (!orderId) {
      return Response.json(
        {
          success: false,
          error: "orderId manquant.",
        },
        { status: 400 }
      );
    }

    const secret = request.headers.get("x-interac-secret");

    if (
      !process.env.ZAPIER_INTERAC_SECRET ||
      secret !== process.env.ZAPIER_INTERAC_SECRET
    ) {
      return Response.json(
        {
          success: false,
          error: "Non autorisé.",
        },
        { status: 401 }
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

    await createProperty({
      name: "Paiement Interac",
      identifier: "interac_payment_status",
      value: "paid",
    });

    if (amount) {
      await createProperty({
        name: "Montant Interac",
        identifier: "interac_amount",
        value: amount,
      });
    }

    if (interacReference) {
      await createProperty({
        name: "Référence Interac",
        identifier: "interac_reference",
        value: interacReference,
      });
    }

    return Response.json({
      success: true,
      orderId,
      paymentStatus: "paid",
      amount: amount || null,
      interacReference: interacReference || null,
      message: "Paiement Interac enregistré dans Booqable.",
    });
  } catch (error) {
    return Response.json(
      {
        success: false,
        error: "Erreur lors de l'enregistrement du paiement Interac.",
        details: error.message,
      },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  return saveInteracPayment(request);
}
