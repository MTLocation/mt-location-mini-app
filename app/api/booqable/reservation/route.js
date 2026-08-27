export async function POST(request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return Response.json(
        {
          success: false,
          message: "Courriel requis.",
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

    // 1. Chercher le client par courriel
    const customerUrl =
      `${baseUrl}/
