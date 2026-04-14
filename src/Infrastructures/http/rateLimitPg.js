import pool from "../database/postgres/pool.js";

// Buat tabel jika belum ada (Aman dieksekusi berulang kali pada cold start Vercel)
pool.query(`
  CREATE TABLE IF NOT EXISTS rate_limits (
    ip VARCHAR(100) PRIMARY KEY,
    hits INT NOT NULL,
    last_reset BIGINT NOT NULL
  )
`).catch((err) => console.error("Gagal inisialisasi tabel rate_limits:", err));

const rateLimitPg = async (req, res, next) => {
  // Ambil IP (dukungan proxy vercel x-forwarded-for)
  let ip = req.ip || req.headers["x-forwarded-for"] || req.connection.remoteAddress || "unknown";
  
  // Jika x-forwarded-for mengirimkan banyak IP, ambil yang pertama
  if (typeof ip === 'string' && ip.includes(',')) {
    ip = ip.split(',')[0].trim();
  }

  const now = Date.now();
  const windowMs = 60 * 1000; // 1 menit
  const maxHits = 90;

  try {
    const result = await pool.query("SELECT hits, last_reset FROM rate_limits WHERE ip = $1", [ip]);

    if (result.rowCount === 0) {
      // Data IP belum ada, masukkan data awal
      await pool.query("INSERT INTO rate_limits (ip, hits, last_reset) VALUES ($1, 1, $2)", [ip, now]);
      return next();
    }

    let { hits, last_reset } = result.rows[0];
    last_reset = parseInt(last_reset);

    if (now - last_reset > windowMs) {
      // Waktu 1 menit telah berlalu, reset hitungannya
      await pool.query("UPDATE rate_limits SET hits = 1, last_reset = $2 WHERE ip = $1", [ip, now]);
      return next();
    }

    if (hits >= maxHits) {
      // Jika melampaui batas, lempar JSON 429 bawaan
      return res.status(429).json({
        status: "fail",
        message: "Terlalu banyak permintaan, silakan coba lagi nanti.",
      });
    }

    // Tambah jumlah hit
    await pool.query("UPDATE rate_limits SET hits = hits + 1 WHERE ip = $1", [ip]);
    next();
  } catch (err) {
    // Fallback: Jika database sibuk/gagal, lebih baik izinkan lolos ketimbang melempar Error 500
    console.error("Rate Limit DB Error:", err);
    next();
  }
};

export default rateLimitPg;
