async function generateIgloohomePin(request) {
  try {
    const clientId = process.env.IGLOOHOME_CLIENT_ID;
    const clientSecret = process.env.IGLOOHOME_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      return Response.json(
        { error: "Identifiants Igloohome manquants." },
        { status: 500 }
      );
    }

    // Récupération des dates de la réservation
    const body = await request.json();

    const reservationStart = body.startDate;
    const reservationEnd = body.endDate;

    if (!reservationStart || !reservationEnd) {
      return Response.json(
        {
          error: "Dates de réservation manquantes.",
        },
        { status: 400 }
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

    /*
      RÈGLE MT LOCATION

      Réservation :
      - début : réservation - 30 minutes
      - fin : réservation + 30 minutes

      Igloohome Hourly exige cependant des heures pleines.

      On arrondit donc vers l'extérieur afin de ne jamais
      bloquer le client.
    */

   // Booqable nous donne les heures de réservation comme heures "locales"
// même si la chaîne contient un indicateur UTC.
// On conserve donc l'heure affichée dans Booqable.

const parseBooqableLocalDate = (dateString) => {
  const clean = dateString.replace("Z", "");

  const [datePart, timePart] = clean.split("T");
  const [year, month, day] = datePart.split("-").map(Number);
  const [hour, minute, second = "0"] = timePart
    .split(/[+-]/)[0]
    .split(":")
    .map(Number);

  return new Date(
    year,
    month - 1,
    day,
    hour,
    minute,
    second
  );
};

const start = parseBooqableLocalDate(reservationStart);
const end = parseBooqableLocalDate(reservationEnd);

// Marge MT Location
start.setMinutes(start.getMinutes() - 30);
end.setMinutes(end.getMinutes() + 30);

// Igloohome Hourly exige des heures pleines.

// Début : heure pleine précédente
start.setMinutes(0, 0, 0);
    // Début : heure pleine précédente
start.setMinutes(0, 0, 0);

// Si cette heure est déjà passée,
// utiliser la prochaine heure pleine
const now = new Date();

if (start < now) {
  start.setTime(now.getTime());
  start.setMinutes(0, 0, 0);
  start.setHours(start.getHours() + 1);
}

// Fin : heure pleine suivante
if (
  end.getMinutes() !== 0 ||
  end.getSeconds() !== 0 ||
  end.getMilliseconds() !== 0
) {
  end.setHours(end.getHours() + 1);
}
end.setMinutes(0, 0, 0);

// Sécurité : la fin doit toujours être après le début
if (end <= start) {
  end.setTime(start.getTime());
  end.setHours(end.getHours() + 1);
}
// Fin : heure pleine suivante
if (
  end.getMinutes() !== 0 ||
  end.getSeconds() !== 0 ||
  end.getMilliseconds() !== 0
) {
  end.setHours(end.getHours() + 1);
}

end.setMinutes(0, 0, 0);

// Trouver automatiquement le bon décalage Toronto
// (-04:00 l'été, -05:00 l'hiver)
const getTorontoOffset = (date) => {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Toronto",
    timeZoneName: "longOffset",
  }).formatToParts(date);

  const offset =
    parts.find((part) => part.type === "timeZoneName")?.value ||
    "GMT-04:00";

  return offset.replace("GMT", "");
};

const formatIgloohomeDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hour = String(date.getHours()).padStart(2, "0");

  const offset = getTorontoOffset(date);

  return `${year}-${month}-${day}T${hour}:00:00${offset}`;
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
          accessName: "MT Location Remorques",
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
      reservationStart,
      reservationEnd,
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

export async function POST(request) {
  return generateIgloohomePin(request);
}
