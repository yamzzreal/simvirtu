export default async function handler(req, res) {
  // Hanya menerima GET
  if (req.method !== "GET") {
    return res.status(405).json({
      success: false,
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
    // Parameter VirtuSIM
    const params = new URLSearchParams({
      api_key: key,
      action: "services",
      country: country,
      service: Whatsapp,
    });

    // Endpoint VirtuSIM
    const url =
      `https://virtusim.com/api/v2/json.php?${params.toString()}`;

    // Request ke VirtuSIM
    const response = await fetch(url);

    // Pastikan HTTP response berhasil
    if (!response.ok) {
      throw new Error(
        `VirtuSIM HTTP ${response.status}`
      );
    }

    // Parse JSON
    const data = await response.json();

    // Periksa response VirtuSIM
    if (!data.status) {
      return res.status(502).json({
        success: false,
        message:
          data?.data?.msg ||
          "VirtuSIM error",
      });
    }

    // Markup harga
    const markup = Number(
      process.env.PRICE_MARKUP || 0
    );

    // Tambahkan harga jual
    data.data = (data.data || []).map((item) => ({
      ...item,

      // Harga asli VirtuSIM
      basePrice: Number(
        item.price || 0
      ),

      // Harga setelah markup
      price:
        Number(item.price || 0) +
        markup,
    }));

    // PENTING:
    // Response tetap menggunakan struktur
    // VirtuSIM seperti sebelumnya.
    return res.status(200).json(data);

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
