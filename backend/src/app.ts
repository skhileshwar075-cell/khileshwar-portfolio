import express, { type Express } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import pinoHttp from "pino-http";
import http from "http";
import router from "./routes";
import { logger } from "./lib/logger";
import { authMiddleware } from "./middlewares/authMiddleware";

const app: Express = express();

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);
app.use(cors({ credentials: true, origin: true }));
app.use(cookieParser());
app.set("trust proxy", true);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(authMiddleware);

app.use("/api", router);

if (process.env.NODE_ENV !== "production") {
  const VITE_PORT = Number(process.env.VITE_PORT ?? 5173);
  app.use((req, res) => {
    const options: http.RequestOptions = {
      hostname: "localhost",
      port: VITE_PORT,
      path: req.url,
      method: req.method,
      headers: { ...req.headers, host: `localhost:${VITE_PORT}` },
    };
    const proxyReq = http.request(options, (proxyRes) => {
      res.writeHead(proxyRes.statusCode ?? 502, proxyRes.headers);
      proxyRes.pipe(res, { end: true });
    });
    proxyReq.on("error", () => {
      res.status(502).send("Frontend dev server not available");
    });
    req.pipe(proxyReq, { end: true });
  });
}

export default app;
