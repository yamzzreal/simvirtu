import { sql } from "@vercel/postgres";
import crypto from "node:crypto";


// ========================================
// DATABASE
// ========================================

export { sql };


// ========================================
// RESPONSE HELPER
// ========================================

export function json(res, status, data) {
  return res.status(status).json(data);
}


// ========================================
// GENERATE ID
// ========================================

export function id(prefix = "id") {
  return `${prefix}_${crypto
    .randomBytes(10)
    .toString("hex")}`;
}


// ========================================
// INITIALIZE DATABASE
// ========================================

export async function initDb() {
  // Users
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      name TEXT NOT NULL,
      balance BIGINT NOT NULL DEFAULT 0,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  // Topups
  await sql`
    CREATE TABLE IF NOT EXISTS topups (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL
        REFERENCES users(id)
        ON DELETE CASCADE,
      order_id TEXT UNIQUE NOT NULL,
      amount BIGINT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      payment_transaction_id TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      paid_at TIMESTAMPTZ
    )
  `;

  // Number orders
  await sql`
    CREATE TABLE IF NOT EXISTS number_orders (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL
        REFERENCES users(id)
        ON DELETE CASCADE,
      virtusim_order_id TEXT NOT NULL,
      service TEXT NOT NULL,
      number TEXT,
      amount BIGINT NOT NULL,
      status TEXT NOT NULL DEFAULT 'active',
      sms TEXT DEFAULT '',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
}


// ========================================
// COOKIE
// ========================================

export function cookie(
  name,
  value,
  maxAge = 86400 * 30
) {
  return [
    `${name}=${encodeURIComponent(value)}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    `Max-Age=${maxAge}`,
    "Secure",
  ].join("; ");
}


// ========================================
// USER SESSION
// ========================================

export function userId(req) {
  const cookies = String(
    req.headers.cookie || ""
  );

  const match = cookies.match(
    /(?:^|;\s*)nn_session=([^;]+)/
  );

  if (!match) {
    return null;
  }

  return decodeURIComponent(match[1]);
}
