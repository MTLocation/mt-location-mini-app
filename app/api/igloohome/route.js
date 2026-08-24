async function generateIgloohomePin() {
  try {
    const clientId = process.env.IGLOOHOME_CLIENT_ID;
    const clientSecret = process.env.IGLOOHOME_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      return Response.json(
        { error: "Identifiants Igloohome manquants." },
        { status: 500 }
      );
    }

    // 1. Authentification Igloohome
    const credentials = Buffer.from(
      `${clientId.trim()}:${clientSecret.trim()}`,
      "utf8"
    ).toString("base64");

    const tokenResponse = await fetch(
      "https://auth.igloohome.co/oauth2/token",
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${credentials}`,
          "Content-Type": "application/x-www-form-urlencoded",
          Accept: "application/json",
        },
        body: new URLSearchParams({
          grant_type: "client_credentials",
        }).toString(),
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

    // 2. Cadenas MT2026-01
    const deviceId = "IGK346001349";

    // Prochaine heure pleine
    const start = new Date();
    start.setMinutes(0, 0, 0);
    start.setHours(start.getHours() + 1);

    // Test de 2 heures
    const end = new Date(start);
    end.setHours(end.getHours() + 2);

    // Format avec l'heure du Québec
    const formatIgloohomeDate = (date) => {
      const parts = new Intl.DateTimeFormat("en-CA", {
        timeZone: "America/Toronto",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hourCycle: "h23",
      }).formatToParts(date);

      const values = {};
      parts.forEach((part) => {
        values[part.type] = part.value;
      });

      return `${values.year}-${values.month}-${values.day}T${values.hour}:00:00-04:00`;
    };

    const startDate = formatIgloohomeDate(start);
    const endDate = formatIgloohomeDate(end);

    // 3. Création du PIN
    const pinResponse = await fetch(
      `https://api.igloodeveloper.co/igloohome/devices/${deviceId}/algopin/hourly`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          variance: 1,
          startDate,
          endDate,
          accessName: "MT Location Remorques - Test",
        }),
      }
    );

    const pinData = await pinResponse.json();

    if (!pinResponse.ok) {
      return Response.json(
        {
          error: "Impossible de créer le PIN Igloohome.",
          startDate,
          endDate,
          details: pinData,
        },
        { status: pinResponse.status }
      );
    }

    return Response.json({
      success: true,
      pin: pinData.pin,
      pinId: pinData.pinId,
      startDate,
      endDate,
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
  return generateIgloohomePin();
}

export async function GET() {
  return generateIgloohomePin();
}
