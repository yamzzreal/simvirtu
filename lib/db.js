import {sql} from '@vercel/postgres';
import crypto from 'node:crypto';
export {sql};
export function json(res,status,data){return res.status(status).json(data)}
export function id(prefix='id'){return prefix+'_'+crypto.randomBytes(10).toString('hex')}
export async function initDb(){
 await sql`CREATE TABLE IF NOT EXISTS users (id TEXT PRIMARY KEY,email TEXT UNIQUE NOT NULL,password_hash TEXT NOT NULL,name TEXT NOT NULL,balance BIGINT NOT NULL DEFAULT 0,created_at TIMESTAMPTZ NOT NULL DEFAULT NOW())`;
 await sql`CREATE TABLE IF NOT EXISTS topups (id TEXT PRIMARY KEY,user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,order_id TEXT UNIQUE NOT NULL,amount BIGINT NOT NULL,status TEXT NOT NULL DEFAULT 'pending',payment_transaction_id TEXT,created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),paid_at TIMESTAMPTZ)`;
 await sql`CREATE TABLE IF NOT EXISTS number_orders (id TEXT PRIMARY KEY,user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,virtusim_order_id TEXT NOT NULL,service TEXT NOT NULL,number TEXT,amount BIGINT NOT NULL,status TEXT NOT NULL DEFAULT 'active',sms TEXT DEFAULT '',created_at TIMESTAMPTZ NOT NULL DEFAULT NOW())`;
}
export function cookie(name,value,maxAge=86400*30){return `${name}=${encodeURIComponent(value)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}; Secure`}
export function userId(req){const c=String(req.headers.cookie||'');const m=c.match(/(?:^|;\s*)nn_session=([^;]+)/);return m?decodeURIComponent(m[1]):null}
