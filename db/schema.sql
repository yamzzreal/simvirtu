CREATE TABLE IF NOT EXISTS users (
 id TEXT PRIMARY KEY,
 email TEXT UNIQUE NOT NULL,
 password_hash TEXT NOT NULL,
 name TEXT NOT NULL,
 balance BIGINT NOT NULL DEFAULT 0,
 created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS topups (
 id TEXT PRIMARY KEY,
 user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 order_id TEXT UNIQUE NOT NULL,
 amount BIGINT NOT NULL,
 status TEXT NOT NULL DEFAULT 'pending',
 payment_transaction_id TEXT,
 created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
 paid_at TIMESTAMPTZ
);
CREATE TABLE IF NOT EXISTS number_orders (
 id TEXT PRIMARY KEY,
 user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 virtusim_order_id TEXT NOT NULL,
 service TEXT NOT NULL,
 number TEXT,
 amount BIGINT NOT NULL,
 status TEXT NOT NULL DEFAULT 'active',
 sms TEXT DEFAULT '',
 created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS topups_user_created ON topups(user_id,created_at DESC);
CREATE INDEX IF NOT EXISTS number_orders_user_created ON number_orders(user_id,created_at DESC);
