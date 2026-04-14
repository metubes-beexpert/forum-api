/* istanbul ignore file */
import { Pool } from 'pg';
import config from '../../../Commons/config.js';

const pool = new Pool(config.database);

// Penanganan error default pada koneksi idle untuk menghindari crash server Vercel (koneksi terputus).
pool.on('error', (err) => {
  console.error("Unexpected error on idle pg connection", err);
});

export default pool;