import bcrypt from 'bcryptjs';
import {sql,id,cookie,userId,initDb} from './db';
export async function register(req,res){
 await initDb(); const b=req.body||{},name=String(b.name||'').trim(),email=String(b.email||'').trim().toLowerCase(),password=String(b.password||'');
 if(name.length<2||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)||password.length<8)return res.status(400).json({success:false,message:'Nama, email valid, dan password minimal 8 karakter wajib diisi'});
 const ex=await sql`SELECT id FROM users WHERE email=${email}`; if(ex.rowCount)return res.status(409).json({success:false,message:'Email sudah terdaftar'});
 const uid=id('usr'),hash=await bcrypt.hash(password,10); await sql`INSERT INTO users(id,email,password_hash,name) VALUES(${uid},${email},${hash},${name})`;res.setHeader('Set-Cookie',cookie('nn_session',uid));return res.json({success:true});
}
export async function login(req,res){
 await initDb();const b=req.body||{},email=String(b.email||'').trim().toLowerCase(),password=String(b.password||'');const r=await sql`SELECT id,password_hash FROM users WHERE email=${email} LIMIT 1;if(!r.rowCount||!(await bcrypt.compare(password,r.rows[0].password_hash)))return res.status(401).json({success:false,message:'Email atau password salah'});res.setHeader('Set-Cookie',cookie('nn_session',r.rows[0].id));res.json({success:true});
}
export async function me(req,res){await initDb();const uid=userId(req);if(!uid)return res.json({success:false});const r=await sql`SELECT id,name,email,balance FROM users WHERE id=${uid}`;if(!r.rowCount)return res.json({success:false});res.json({success:true,user:r.rows[0]})}
