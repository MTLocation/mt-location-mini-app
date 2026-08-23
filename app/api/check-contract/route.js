export async function POST(request) {
  try {
    const { orderId } = await request.json();

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

    const documentsUrl =
      `${baseUrl}/documents.json` +
      `?filter[order_id][eq]=${encodeURIComponent(orderId)}`;

    const response = await fetch(documentsUrl, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        Accept: "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      const details = await response.text();

      return Response.json(
        {
          success: false,
          message: "Impossible de vérifier le contrat.",
          details,
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    const documents = data.data || [];

    const contract = documents.find((document) => {
      const attributes = document.attributes || document;

      return (
        attributes.document_type === "contract" &&
        attributes.archived !== true
      );
    });

    if (!contract) {
      return Response.json({
        success: true,
        contractFound: false,
        signed: false,
        message: "Aucun contrat trouvé.",
      });
    }

    const attributes = contract.attributes || contract;

    return Response.json({
      success: true,
      contractFound: true,
      signed: attributes.signed === true,
      contractId: contract.id,
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
