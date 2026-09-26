import { sql } from "@vercel/postgres";

export default async function handler(req, res) {
  try {
    const result = await sql`SELECT NOW() AS now`;

    return res.status(200).json({
      success: true,
      database: "connected",
      time: result.rows[0].now,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Database connection failed",
      error: error.message,
    });
  }
}
