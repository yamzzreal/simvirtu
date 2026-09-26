export default async function handler(req, res) {
  // Hanya menerima GET
  if (req.method !== "GET") {
    return res.status(405).json({
      success: false,
      message: "Method tidak diizinkan",
    });
  }

  // Ambil API Key
  const key = process.env.VIRTUSIM_API_KEY;

  if (!key) {
    return res.status(500).json({
      success: false,
      message: "VIRTUSIM_API_KEY belum diset",
    });
  }

  // Ambil parameter dari frontend
  const country = req.query.country || "indo";
  const service = req.query.service || "";

  try {
    // Buat URL VirtuSIM
    const params = new URLSearchParams({
      api_key: key,
      action: "services",
      country,
      service,
    });

    const url = `https://virtusim.com/api/v2/json.php?${params}`;

    console.log("VirtuSIM Request:", {
      country,
      service,
    });

    // Request ke VirtuSIM
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(
        `VirtuSIM HTTP ${response.status}`
      );
    }

    const data = await response.json();

    // Periksa response VirtuSIM
    if (!data.status) {
      return res.status(502).json({
        success: false,
        message:
          data?.data?.msg ||
          "VirtuSIM mengembalikan error",
      });
    }

    // Markup harga
    const markup = Number(
      process.env.PRICE_MARKUP || 0
    );

    // Format produk
    const products = (data.data || []).map((item) => ({
      ...item,

      basePrice: Number(item.price || 0),

      price:
        Number(item.price || 0) +
        markup,
    }));

    // Response ke frontend
    return res.status(200).json({
      success: true,
      country,
      service,
      products,
    });
  } catch (error) {
    console.error(
      "VirtuSIM API Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Gagal menghubungi VirtuSIM",
    });
  }
}
