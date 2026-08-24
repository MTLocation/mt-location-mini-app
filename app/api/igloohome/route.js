 async function testIgloohome() {
  try {
    const clientId = process.env.IGLOOHOME_CLIENT_ID;
    const clientSecret = process.env.IGLOOHOME_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
  return Response.json(
    {
      error: "Identifiants Igloohome manquants.",
      clientIdPresent: !!clientId,
      clientSecretPresent: !!clientSecret,
    },
    { status: 500 }
  );
}
    }

    const credentials = Buffer.from(
      `${clientId}:${clientSecret}`
    ).toString("base64");

    const tokenResponse = await fetch(
      "https://auth.igloohome.co/oauth2/token",
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${credentials}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          grant_type: "client_credentials",
          scope: "igloohomeapi/algopin-hourly",
        }),
      }
    );

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok) {
      return Response.json(
        {
          error: "Impossible d'obtenir le jeton Igloohome.",
          details: tokenData,
        },
        { status: tokenResponse.status }
      );
    }

    return Response.json({
      success: true,
      message: "Connexion Igloohome réussie.",
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
export async function POST() {
  return testIgloohome();
}

export async function GET() {
  return testIgloohome();
}
