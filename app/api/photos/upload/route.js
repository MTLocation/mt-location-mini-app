export async function POST(request) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseSecret = process.env.SUPABASE_SECRET_KEY;

    if (!supabaseUrl || !supabaseSecret) {
      return Response.json(
        {
          success: false,
          error: "Configuration Supabase manquante.",
        },
        { status: 500 }
      );
    }

    const formData = await request.formData();

    const file = formData.get("file");
    const orderId = formData.get("orderId");
    const category = formData.get("category");
    const photoType = formData.get("photoType");

    if (!file || !orderId || !category || !photoType) {
      return Response.json(
        {
          success: false,
          error: "Informations manquantes.",
        },
        { status: 400 }
      );
    }

    if (!file.type?.startsWith("image/")) {
      return Response.json(
        {
          success: false,
          error: "Le fichier doit être une image.",
        },
        { status: 400 }
      );
    }

    const maxSize = 10 * 1024 * 1024;

    if (file.size > maxSize) {
      return Response.json(
        {
          success: false,
          error: "Image trop volumineuse.",
        },
        { status: 400 }
      );
    }

    const extension =
      file.name?.split(".").pop()?.toLowerCase() || "jpg";

    const safeCategory = String(category).replace(
      /[^a-zA-Z0-9_-]/g,
      ""
    );

    const safePhotoType = String(photoType).replace(
      /[^a-zA-Z0-9_-]/g,
      ""
    );

    const safeOrderId = String(orderId).replace(
      /[^a-zA-Z0-9_-]/g,
      ""
    );

    const filename =
      `${safePhotoType}-${Date.now()}.${extension}`;

    const path =
      `${safeOrderId}/${safeCategory}/${filename}`;

    const arrayBuffer = await file.arrayBuffer();

    const uploadResponse = await fetch(
      `${supabaseUrl}/storage/v1/object/mt-location-photos/${path}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${supabaseSecret}`,
          apikey: supabaseSecret,
          "Content-Type": file.type || "image/jpeg",
          "x-upsert": "false",
        },
        body: arrayBuffer,
      }
    );

    const uploadText = await uploadResponse.text();

    let uploadData;

    try {
      uploadData = JSON.parse(uploadText);
    } catch {
      uploadData = uploadText;
    }

    if (!uploadResponse.ok) {
      return Response.json(
        {
          success: false,
          error: "Impossible d'enregistrer la photo.",
          details: uploadData,
        },
        { status: uploadResponse.status }
      );
    }

    return Response.json({
      success: true,
      path,
    });
  } catch (error) {
    return Response.json(
      {
        success: false,
        error: "Erreur lors de l'enregistrement.",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
