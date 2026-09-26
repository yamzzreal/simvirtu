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

  try {
    // Gunakan parameter yang sama
    // dengan kode awal project
    const country = req.query.country || "Russia";

    const url =
      `https://virtusim.com/api/v2/json.php` +
      `?api_key=${encodeURIComponent(key)}` +
      `&action=services` +
      `&country=${encodeURIComponent(country)}` +
      `&service=`;

    console.log("VirtuSIM URL:", url.replace(key, "***"));

    // Request ke VirtuSIM
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(
        `VirtuSIM HTTP ${response.status}`
      );
    }

    const data = await response.json();

    console.log(
      "VirtuSIM Response:",
      JSON.stringify(data)
    );

    // Cek response VirtuSIM
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

      basePrice: Number(
        item.price || 0
      ),

      price:
        Number(item.price || 0) +
        markup,
    }));

    // Pertahankan format response asli
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
