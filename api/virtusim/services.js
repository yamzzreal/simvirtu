export default async function handler(req, res) {
  // Hanya menerima GET
  if (req.method !== "GET") {
    return res.status(405).json({
      success: false,
    });
  }

  // Ambil API Key dari Environment Variable
  const key = process.env.VIRTUSIM_API_KEY;

  if (!key) {
    return res.status(500).json({
      success: false,
      message: "VIRTUSIM_API_KEY belum diset",
    });
  }

  // Negara default: Indonesia
  const country = req.query.country || "indo";

  try {
    // Request ke API VirtuSIM
    const url =
      `https://virtusim.com/api/v2/json.php` +
      `?api_key=${encodeURIComponent(key)}` +
      `&action=services` +
      `&country=Russia&service=`;

    const response = await fetch(url);
    const data = await response.json();

    // Jika VirtuSIM mengembalikan error
    if (!data.status) {
      return res.status(502).json({
        success: false,
        message: data?.data?.msg || "VirtuSIM error",
      });
    }

    // Tambahkan markup harga
    const markup = Number(process.env.PRICE_MARKUP || 0);

    data.data = (data.data || []).map((item) => ({
      ...item,

      // Harga asli dari VirtuSIM
      basePrice: Number(item.price || 0),

      // Harga setelah markup
      price: Number(item.price || 0) + markup,
    }));

    // Kirim response ke frontend
    return res.status(200).json(data);
  } catch (error) {
    console.error("VirtuSIM API Error:", error);

    return res.status(500).json({
      success: false,
      message: "Gagal menghubungi VirtuSIM",
    });
  }
}
