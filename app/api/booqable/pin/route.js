export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get("orderId");

    if (!orderId) {
      return Response.json(
        {
          success: false,
          error: "orderId manquant.",
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

    const baseUrl =
      "https://mt-location-remorques.booqable.com/api/4";

    const propertiesUrl =
      `${baseUrl}/properties.json` +
      `?filter[owner_id][eq]=${encodeURIComponent(orderId)}` +
      `&filter[owner_type][eq]=orders` +
      `&filter[identifier][eq]=igloohome_pin`;

    const response = await fetch(propertiesUrl, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        Accept: "application/json",
      },
      cache: "no-store",
    });

    const responseText = await response.text();

    let data;

    try {
      data = JSON.parse(responseText);
    } catch {
      data = responseText;
    }

    if (!response.ok) {
      return Response.json(
        {
          success: false,
          error: "Impossible de récupérer le PIN Booqable.",
          details: data,
        },
        { status: response.status }
      );
    }

    const properties = data?.data || [];

    const pinProperty = properties.find(
      (property) =>
        property.identifier === "igloohome_pin" ||
        property.attributes?.identifier === "igloohome_pin"
    );

    const pin =
      pinProperty?.value ??
      pinProperty?.attributes?.value ??
      null;

    if (!pin) {
      return Response.json(
        {
          success: false,
          found: false,
          error: "Aucun code d'accès trouvé pour cette réservation.",
        },
        { status: 404 }
      );
    }

    return Response.json({
      success: true,
      found: true,
      orderId,
      pin: String(pin),
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
