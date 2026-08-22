export async function POST(request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return Response.json(
        { success: false, message: "Courriel requis." },
        { status: 400 }
      );
    }

    const apiKey = process.env.BOOQABLE_API_KEY;

    if (!apiKey) {
      return Response.json(
        { success: false, message: "Clé Booqable manquante." },
        { status: 500 }
      );
    }

    const baseUrl =
      "https://mt-location-remorques.booqable.com/api/4";

    // 1. Chercher le client par courriel
    const customerUrl =
      `${baseUrl}/customers.json` +
      `?filter[email][eql]=${encodeURIComponent(email)}`;

    const customerResponse = await fetch(customerUrl, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        Accept: "application/json",
      },
      cache: "no-store",
    });

    if (!customerResponse.ok) {
      const errorText = await customerResponse.text();

      return Response.json(
        {
          success: false,
          message: "Erreur lors de la recherche du client.",
          details: errorText,
        },
        { status: customerResponse.status }
      );
    }

    const customerData = await customerResponse.json();
    const customers = customerData.data || [];

    if (customers.length === 0) {
      return Response.json(
        {
          success: false,
          found: false,
          message: "Aucun client trouvé avec ce courriel.",
        },
        { status: 404 }
      );
    }

    const customer = customers[0];

    // 2. Chercher les commandes de ce client
    const ordersUrl =
      `${baseUrl}/orders.json` +
      `?filter[customer_id][eq]=${encodeURIComponent(customer.id)}` +
      `&include=customer` +
      `&sort=-starts_at` +
      `&page[size]=100`;

    const ordersResponse = await fetch(ordersUrl, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        Accept: "application/json",
      },
      cache: "no-store",
    });

    if (!ordersResponse.ok) {
      const errorText = await ordersResponse.text();

      return Response.json(
        {
          success: false,
          message: "Erreur lors de la recherche de la réservation.",
          details: errorText,
        },
        { status: ordersResponse.status }
      );
    }

   

    const ordersData = await ordersResponse.json();
const orders = ordersData.data || [];
    return Response.json({
  debug: true,
  orders: orders.map((item) => ({
    id: item.id,
    number: item.number,
    status: item.status,
    starts_at: item.starts_at,
    stops_at: item.stops_at,
  })),
});

const nowLocal = new Date();

const formatter = new Intl.DateTimeFormat("en-CA", {
  timeZone: "America/Toronto",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
});

const parts = Object.fromEntries(
  formatter
    .formatToParts(nowLocal)
    .filter((part) => part.type !== "literal")
    .map((part) => [part.type, part.value])
);

const now = new Date(
  Date.UTC(
    Number(parts.year),
    Number(parts.month) - 1,
    Number(parts.day),
    Number(parts.hour),
    Number(parts.minute),
    Number(parts.second)
  )
);

const order = orders.find((item) => {
  if (
    item.status !== "reserved" &&
    item.status !== "started"
  ) {
    return false;
  }

  const startsAt = new Date(item.starts_at);
  const stopsAt = new Date(item.stops_at);

  // Accès permis 30 minutes avant la prise de possession
  const accessStartsAt = new Date(
    startsAt.getTime() - 30 * 60 * 1000
  );

  return now >= accessStartsAt && now <= stopsAt;
});
    
        

    if (!order) {
      return Response.json(
        {
          success: false,
          found: false,
          message: "Aucune réservation trouvée pour ce client.",
        },
        { status: 404 }
      );
    }

    return Response.json({
      success: true,
      found: true,
      customer: {
        id: customer.id,
        name: customer.name,
        email: customer.email,
      },
      reservation: {
        id: order.id,
        number: order.number,
        status: order.status,
        startsAt: order.starts_at,
        stopsAt: order.stops_at,
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
