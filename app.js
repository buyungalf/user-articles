import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { errorHandler } from "./middleware/errorHandler.js";
import connectDB from "./db/connect.js";

import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger.js";

import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import articleRoutes from "./routes/article.routes.js";
import pageViewRoutes from "./routes/pageView.routes.js";

// Load environment variables
dotenv.config();

// Validate essential environment variables
const { MONGO_URI, PORT = 5000 } = process.env;
if (!MONGO_URI) {
  console.error("MONGO_URI is not defined in .env file");
  process.exit(1);
}

const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/articles", articleRoutes);
app.use("/api/page-view", pageViewRoutes);

// Swagger UI setup
const swaggerUiOptions = {
  customSiteTitle: "MySkill API Documentation",
  customCss: ".swagger-ui .topbar { display: none }",
  swaggerOptions: {
    urls: [
      {
        url: "/swagger.json",
        name: "API",
      },
    ],
    oauth2RedirectUrl: `http://${HOST}:${PORT}/api-docs/oauth2-redirect.html`,
    validatorUrl: null,
  },
};

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, swaggerUiOptions)
);

app.get("/swagger.json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

app.get("/", (req, res) => {
  res.status(200).json({ message: "API is running" });
});

app.use(errorHandler);
const HOST = process.env.NODE_ENV !== "production" ? "localhost" : "0.0.0.0";

// Start server
const start = async () => {
  try {
    await connectDB(MONGO_URI);
    app.listen(PORT, HOST, () => {
      console.log(`[LOG] Server running on http://${HOST}:${PORT}`);
    });
  } catch (error) {
    console.error("[LOG] Failed to start server:", error);
    process.exit(1);
  }
};

start();
