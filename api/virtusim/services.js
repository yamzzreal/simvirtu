export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed",
    });
  }

  const key = process.env.VIRTUSIM_API_KEY;

  if (!key) {
    return res.status(500).json({
      success: false,
      message: "VIRTUSIM_API_KEY belum diset",
    });
  }

  const country = req.query.country || "Russia";

  try {
    const url =
      `https://virtusim.com/api/v2/json.php` +
      `?api_key=${encodeURIComponent(key)}` +
      `&action=services` +
      `&country=${encodeURIComponent(country)}` +
      `&service=`;

    const response = await fetch(url);

    const text = await response.text();

    console.log("VirtuSIM HTTP:", response.status);
    console.log("VirtuSIM Response:", text);

    let data;

    try {
      data = JSON.parse(text);
    } catch (parseError) {
      return res.status(502).json({
        success: false,
        message: "VirtuSIM tidak mengembalikan JSON",
        httpStatus: response.status,
        response: text.substring(0, 500),
      });
    }

    if (!data.status) {
      return res.status(502).json({
        success: false,
        message:
          data?.data?.msg ||
          "VirtuSIM error",
      });
    }

    const markup = Number(
      process.env.PRICE_MARKUP || 0
    );

    data.data = (data.data || []).map((item) => ({
      ...item,
      basePrice: Number(item.price || 0),
      price: Number(item.price || 0) + markup,
    }));

    return res.status(200).json(data);

  } catch (error) {
    console.error("VirtuSIM Error:", error);

    return res.status(500).json({
      success: false,
      message: "Gagal menghubungi VirtuSIM",
      error: error.message,
    });
  }
}
