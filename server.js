const express = require("express"), crypto = require("crypto"), fs = require("fs"), path = require("path");
const app = express(), PORT = process.env.PORT || 3000;
const DB = path.join(process.env.DATA_DIR || __dirname, "db.json");
const DEMO = process.env.DEMO_CODES !== "0"; // "0" bo‘lsa kod ekranda ko‘rsatilmaydi

let db = { users: [], sessions: {}, msgs: [] };
try { db = Object.assign(db, JSON.parse(fs.readFileSync(DB, "utf8"))); } catch (e) {}
let st; const save = () => { clearTimeout(st); st = setTimeout(() => fs.writeFile(DB, JSON.stringify(db), () => {}), 200); };
const pend = {}, rst = {}; // tasdiqlash va tiklash kodlari (xotirada, 10 daqiqa)

// ixtiyoriy haqiqiy email: SMTP_URL=smtps://user:pass@smtp.host  va  npm i nodemailer
let mail = null;
try { if (process.env.SMTP_URL) mail = require("nodemailer").createTransport(process.env.SMTP_URL); } catch (e) { console.log("nodemailer topilmadi"); }
const send = (to, subject, text) => {
  console.log(`📨 ${to}: ${text}`);
  if (mail) mail.sendMail({ from: process.env.MAIL_FROM || "Orbita <no-reply@orbita.uz>", to, subject, text }).catch(console.error);
};
const demo = c => (mail || !DEMO ? {} : { demo: c });

const hash = (p, s = crypto.randomBytes(16).toString("hex")) => s + ":" + crypto.scryptSync(p, s, 32).toString("hex");
const check = (p, h) => { const a = Buffer.from(hash(p, h.split(":")[0])), b = Buffer.from(h); return a.length === b.length && crypto.timingSafeEqual(a, b); };
const code = () => String(crypto.randomInt(1000, 10000)); 
const pub = u => ({ n: u.n, u: u.u, e: u.e, av: u.av, int: u.int, t: u.t, xp: u.xp, tasks: u.tasks });
const em = s => String(s || "").trim().toLowerCase();

app.use(express.json({ limit: "20kb" }));
const hits = {};
app.use("/api", (q, r, n) => { // oddiy so‘rovlar chegarasi
  const k = q.ip + q.path, t = Date.now(), max = /login|register|forgot|reset/.test(q.path) ? 10 : 120;
  hits[k] = (hits[k] || []).filter(x => t - x < 6e4);
  if (hits[k].push(t) > max) return r.status(429).json({ err: "Juda ko‘p urinish, 1 daqiqa kuting" });
  n();
});

const sid = q => (/(?:^|; )sid=([a-f0-9]+)/.exec(q.headers.cookie || "") || [])[1];
const userOf = q => { const s = db.sessions[sid(q)]; return s && db.users.find(x => x.e === s.e); };
const auth = (q, r, n) => { const u = userOf(q); if (!u) return r.status(401).json({ err: "Avval tizimga kiring" }); q.u = u; n(); };
const login = (r, u, rem) => {
  const id = crypto.randomBytes(24).toString("hex"); db.sessions[id] = { e: u.e }; save();
  r.setHeader("Set-Cookie", `sid=${id}; Path=/; HttpOnly; SameSite=Lax${rem ? "; Max-Age=2592000" : ""}`);
};
const out = u => ({ user: pub(u) });

app.post("/api/register/start", (q, r) => {
  const { n, e, pw, u, av, int } = q.body || {}, E = em(e), U = em(u);
  if (String(n || "").trim().length < 2 || !/^\S+@\S+\.\S+$/.test(E) || String(pw || "").length < 6 || !/^[a-z0-9_]{3,16}$/.test(U))
    return r.status(400).json({ err: "Ma’lumotlar noto‘g‘ri kiritilgan" });
  if (db.users.some(x => x.e === E)) return r.status(409).json({ err: "Bu email allaqachon ro‘yxatdan o‘tgan" });
  if (db.users.some(x => x.u === U)) return r.status(409).json({ err: "Bu nom band, boshqasini tanlang" });
  const c = code();
  pend[E] = { c, x: Date.now() + 6e5, d: { n: String(n).trim().slice(0, 60), u: U, e: E, h: hash(String(pw)), av: String(av || "🦊").slice(0, 8), int: (Array.isArray(int) ? int : []).slice(0, 6).map(s => String(s).slice(0, 20)) } };
  send(E, "Orbita tasdiqlash kodi", "Kodingiz: " + c); r.json({ ok: 1, ...demo(c) });
});
app.post("/api/register/resend", (q, r) => {
  const p = pend[em(q.body && q.body.e)]; if (!p) return r.status(400).json({ err: "Avval ro‘yxatdan o‘tishni boshlang" });
  p.c = code(); p.x = Date.now() + 6e5; send(p.d.e, "Orbita tasdiqlash kodi", "Yangi kod: " + p.c); r.json({ ok: 1, ...demo(p.c) });
});
app.post("/api/register/verify", (q, r) => {
  const E = em(q.body && q.body.e), p = pend[E];
  if (!p || p.x < Date.now() || p.c !== String(q.body.code || "").trim()) return r.status(400).json({ err: "Kod noto‘g‘ri yoki eskirgan" });
  if (db.users.some(x => x.e === E || x.u === p.d.u)) return r.status(409).json({ err: "Hisob allaqachon mavjud" });
  const u = { ...p.d, t: Date.now(), xp: 0, tasks: [] }; db.users.push(u); delete pend[E]; login(r, u, true); r.json(out(u));
});
app.post("/api/login", (q, r) => {
  const { id, pw, rem } = q.body || {}, k = em(id), u = db.users.find(x => x.e === k || x.u === k);
  if (!u || !check(String(pw || ""), u.h)) return r.status(401).json({ err: "Login yoki parol noto‘g‘ri" });
  login(r, u, !!rem); r.json(out(u));
});
app.post("/api/logout", (q, r) => { delete db.sessions[sid(q)]; save(); r.setHeader("Set-Cookie", "sid=; Path=/; Max-Age=0"); r.json({ ok: 1 }); });
app.post("/api/forgot", (q, r) => {
  const E = em(q.body && q.body.e), u = db.users.find(x => x.e === E);
  if (!u) return r.json({ ok: 1 }); // email borligini oshkor qilmaymiz
  const c = code(); rst[E] = { c, x: Date.now() + 6e5 }; send(E, "Orbita: parolni tiklash", "Tiklash kodi: " + c); r.json({ ok: 1, ...demo(c) });
});
app.post("/api/reset", (q, r) => {
  const { e, code: c, pw } = q.body || {}, E = em(e), t = rst[E], u = db.users.find(x => x.e === E);
  if (!t || !u || t.x < Date.now() || t.c !== String(c || "").trim()) return r.status(400).json({ err: "Kod noto‘g‘ri yoki eskirgan" });
  if (String(pw || "").length < 6) return r.status(400).json({ err: "Parol kamida 6 ta belgi bo‘lsin" });
  u.h = hash(String(pw)); delete rst[E];
  for (const k in db.sessions) if (db.sessions[k].e === E) delete db.sessions[k];
  save(); r.json({ ok: 1 });
});
app.post("/api/contact", (q, r) => {
  const { n, e, m } = q.body || {};
  if (!String(n || "").trim() || !/^\S+@\S+\.\S+$/.test(String(e || "")) || !String(m || "").trim()) return r.status(400).json({ err: "Barcha maydonlarni to‘ldiring" });
  db.msgs.push({ n: String(n).slice(0, 60), e: String(e).slice(0, 80), m: String(m).slice(0, 1000), t: Date.now() }); save(); r.json({ ok: 1 });
});

app.get("/api/me", (q, r) => { const u = userOf(q); r.json({ user: u ? pub(u) : null }); });
app.put("/api/me", auth, (q, r) => {
  const n = String((q.body || {}).n || "").trim();
  if (n.length < 2) return r.status(400).json({ err: "Ism juda qisqa" });
  q.u.n = n.slice(0, 60); save(); r.json(out(q.u));
});
app.delete("/api/me", auth, (q, r) => {
  db.users = db.users.filter(x => x !== q.u);
  for (const k in db.sessions) if (db.sessions[k].e === q.u.e) delete db.sessions[k];
  save(); r.setHeader("Set-Cookie", "sid=; Path=/; Max-Age=0"); r.json({ ok: 1 });
});
app.post("/api/tasks", auth, (q, r) => {
  const x = String((q.body || {}).x || "").trim().slice(0, 120);
  if (!x) return r.status(400).json({ err: "Vazifa bo‘sh" });
  if (q.u.tasks.length >= 200) return r.status(400).json({ err: "Vazifalar soni chegarasi" });
  q.u.tasks.unshift({ id: crypto.randomUUID(), x, d: false }); save(); r.json(out(q.u));
});
app.patch("/api/tasks/:id", auth, (q, r) => {
  const t = q.u.tasks.find(x => x.id === q.params.id); if (!t) return r.status(404).json({ err: "Topilmadi" });
  const d = !!(q.body || {}).d;
  if (d !== t.d) { t.d = d; q.u.xp = Math.max(0, q.u.xp + (d ? 10 : -10)); }
  save(); r.json(out(q.u));
});
app.delete("/api/tasks/:id", auth, (q, r) => { q.u.tasks = q.u.tasks.filter(x => x.id !== q.params.id); save(); r.json(out(q.u)); });
app.post("/api/focus", auth, (q, r) => { q.u.xp += 20; save(); r.json(out(q.u)); });

app.use(express.static(path.join(__dirname, "public")));
app.listen(PORT, () => console.log("✅ Orbita ishga tushdi: http://localhost:" + PORT));
