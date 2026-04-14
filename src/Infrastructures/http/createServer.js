import express from "express";
import ClientError from "../../Commons/exceptions/ClientError.js";
import DomainErrorTranslator from "../../Commons/exceptions/DomainErrorTranslator.js";
import users from "../../Interfaces/http/api/users/index.js";
import authentications from "../../Interfaces/http/api/authentications/index.js";
import threads from "../../Interfaces/http/api/threads/index.js";
import likes from "../../Interfaces/http/api/likes/index.js";
import rateLimitPg from "./rateLimitPg.js";

const createServer = async (container) => {
  const app = express();
  
  // Wajib pada lingkungan Vercel/Proxy agar express-rate-limit berjalan dengan aman tanpa error saat menangkap IP.
  app.set("trust proxy", 1);

  // Middleware for parsing JSON
  app.use(express.json());

  // Setup custom rate limit menggunakan PostgresDB
  // Hal ini memastikan Vercel Serverless bisa memiliki memory terpusat (centralized store) tanpa crash
  const threadsLimiter = rateLimitPg;

  // Register routes
  app.use("/users", users(container));
  app.use("/authentications", authentications(container));
  app.use("/threads", threadsLimiter, threads(container));
  likes.register(app, { container });

  // Global error handler
  app.use((error, req, res, next) => {
    const translatedError = DomainErrorTranslator.translate(error);

    // Perbaikan Krusial: Gunakan pengecekan .statusCode selain instanceof
    // Ini mengamankan bug ESM import pada NodeJS
    if (translatedError instanceof ClientError || translatedError.statusCode) {
      const statusCode = translatedError.statusCode || 400;
      return res.status(statusCode).json({
        status: "fail",
        message: translatedError.message,
      });
    }

    // Jika error sampai di sini, berarti ini Error 500 sungguhan (bug/crash).
    // Kita WAJIB mencetak error-nya ke terminal agar tahu persis baris kode mana yang rusak.
    console.error("🔥 SERVER ERROR (500):", error);

    return res.status(500).json({
      status: "error",
      message: "terjadi kegagalan pada server kami",
    });
  });

  // 404 handler
  app.use((req, res) => {
    res.status(404).json({
      status: "fail",
      message: "Route not found",
    });
  });

  return app;
};

export default createServer;
