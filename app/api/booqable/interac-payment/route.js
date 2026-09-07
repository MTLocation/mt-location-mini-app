async function saveInteracPayment(request) {
  try {
    const body = await request.json();

    const orderNumber = body.orderNumber;
    let orderId = body.orderId || null;

    const amount = body.amount;
    const interacReference = body.interacReference;

    // Sécurité Zapier
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

    if (!orderId && !orderNumber) {
      return Response.json(
        {
          success: false,
          error: "orderNumber ou orderId requis.",
        },
        { status: 400 }
      );
    }

    const baseUrl =
      "https://mt-location-remorques.booqable.com/api/4";

    // ---------------------------------------------------
    // 1. Retrouver automatiquement l'UUID avec le numéro
    // ---------------------------------------------------

    if (!orderId) {
      const searchUrl =
        `${baseUrl}/orders.json` +
        `?filter[number][eq]=${encodeURIComponent(orderNumber)}` +
        `&page[size]=10`;

      const searchResponse = await fetch(searchUrl, {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          Accept: "application/json",
        },
        cache: "no-store",
      });

      if (!searchResponse.ok) {
        const errorText = await searchResponse.text();

        return Response.json(
          {
            success: false,
            error: "Erreur lors de la recherche de la commande.",
            details: errorText,
          },
          { status: searchResponse.status }
        );
      }

      const searchData = await searchResponse.json();
      let orders = searchData.data || [];

      let order = orders.find(
        (item) =>
          String(item.number) === String(orderNumber)
      );

      // Sécurité supplémentaire au cas où le filtre Booqable
      // ne retourne pas directement le résultat attendu.
      if (!order) {
        const fallbackResponse = await fetch(
          `${baseUrl}/orders.json?sort=-starts_at&page[size]=100`,
          {
            headers: {
              Authorization: `Bearer ${apiKey}`,
              Accept: "application/json",
            },
            cache: "no-store",
          }
        );

        if (fallbackResponse.ok) {
          const fallbackData =
            await fallbackResponse.json();

          orders = fallbackData.data || [];

          order = orders.find(
            (item) =>
              String(item.number) ===
              String(orderNumber)
          );
        }
      }

      if (!order) {
        return Response.json(
          {
            success: false,
            error: `Commande #${orderNumber} introuvable.`,
          },
          { status: 404 }
        );
      }

      orderId = order.id;
    }

    // ---------------------------------------------------
    // 2. Créer les propriétés dans la commande Booqable
    // ---------------------------------------------------

    const createProperty = async ({
      name,
      identifier,
      value,
    }) => {
      const response = await fetch(
        `${baseUrl}/properties`,
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

    // Paiement confirmé
    await createProperty({
      name: "Paiement Interac",
      identifier: "interac_payment_status",
      value: "paid",
    });

    // Montant reçu
    if (amount) {
      await createProperty({
        name: "Montant Interac",
        identifier: "interac_amount",
        value: amount,
      });
    }

    // Référence MT-61
    if (interacReference) {
      await createProperty({
        name: "Référence Interac",
        identifier: "interac_reference",
        value: interacReference,
      });
    }

    return Response.json({
      success: true,
      orderNumber: orderNumber || null,
      orderId,
      paymentStatus: "paid",
      amount: amount || null,
      interacReference: interacReference || null,
      message:
        "Paiement Interac enregistré dans Booqable.",
    });
  } catch (error) {
    return Response.json(
      {
        success: false,
        error:
          "Erreur lors de l'enregistrement du paiement Interac.",
        details: error.message,
      },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  return saveInteracPayment(request);
}
