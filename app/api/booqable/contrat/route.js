export async function POST(request) {
  try {
    const { orderId, email, customerId } = await request.json();

    if (!orderId) {
      return Response.json(
        {
          success: false,
          message: "ID de réservation requis.",
        },
        { status: 400 }
      );
    }

    const apiKey = process.env.BOOQABLE_API_KEY;

    if (!apiKey) {
      return Response.json(
        {
          success: false,
          message: "Clé Booqable manquante.",
        },
        { status: 500 }
      );
    }

    const baseUrl =
      "https://mt-location-remorques.booqable.com/api/4";

    // 1. Chercher les documents de cette commande
    const documentsUrl =
      `${baseUrl}/documents.json` +
      `?filter[order_id][eq]=${encodeURIComponent(orderId)}`;

    const documentsResponse = await fetch(documentsUrl, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        Accept: "application/json",
      },
      cache: "no-store",
    });

    if (!documentsResponse.ok) {
      const details = await documentsResponse.text();

      return Response.json(
        {
          success: false,
          message: "Erreur lors de la recherche du contrat.",
          details,
        },
        { status: documentsResponse.status }
      );
    }

    const documentsData = await documentsResponse.json();
    const documents = documentsData.data || [];

    // Chercher un contrat existant non archivé
    let contract = documents.find(
      (document) =>
        document.document_type === "contract" &&
        document.archived !== true
    );

    // 2. Aucun contrat : en créer un
    if (!contract) {
      const createResponse = await fetch(
        `${baseUrl}/documents`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            data: {
              type: "documents",
              attributes: {
                document_type: "contract",
                order_id: orderId,
              },
            },
          }),
        }
      );

      if (!createResponse.ok) {
        const details = await createResponse.text();

        return Response.json(
          {
            success: false,
            message: "Impossible de créer le contrat.",
            details,
          },
          { status: createResponse.status }
        );
      }

      const createData = await createResponse.json();

      contract = {
        id: createData.data.id,
        ...createData.data.attributes,
      };
    }

    return Response.json({
      success: true,
      contract: {
        id: contract.id,
        number: contract.number,
        signed: contract.signed || false,
        sent: contract.sent || false,
      },
    });
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: "Erreur interne.",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
