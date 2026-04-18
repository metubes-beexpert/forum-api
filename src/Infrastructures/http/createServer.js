import express from "express";
import rateLimit from "express-rate-limit";
import ClientError from "../../Commons/exceptions/ClientError.js";
import DomainErrorTranslator from "../../Commons/exceptions/DomainErrorTranslator.js";
import users from "../../Interfaces/http/api/users/index.js";
import authentications from "../../Interfaces/http/api/authentications/index.js";
import threads from "../../Interfaces/http/api/threads/index.js";
import likes from "../../Interfaces/http/api/likes/index.js";

const createServer = async (container) => {
  const app = express();

  // Wajib agar express-rate-limit berjalan dengan aman saat menggunakan Ngrok
  app.set("trust proxy", 1);

  app.use(express.json());

  // Setup Rate Limit Standar (Memory Store) untuk Ngrok/Lokal
  const threadsLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 menit
    max: 90, // Limit setiap IP maksimal 90 request per menit
    message: {
      status: "fail",
      message: "Terlalu banyak permintaan, silakan coba lagi nanti.",
    },
    standardHeaders: true,
    legacyHeaders: false,
  });

  // Register routes
  app.use("/users", users(container));
  app.use("/authentications", authentications(container));

  // Pasang limiter HANYA di route threads sesuai kriteria
  app.use("/threads", threadsLimiter, threads(container));

  likes.register(app, { container });

  // Global error handler
  app.use((error, req, res, next) => {
    const translatedError = DomainErrorTranslator.translate(error);

    if (translatedError instanceof ClientError || translatedError.statusCode) {
      const statusCode = translatedError.statusCode || 400;
      return res.status(statusCode).json({
        status: "fail",
        message: translatedError.message,
      });
    }

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
