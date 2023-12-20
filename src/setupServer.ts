import {
  Application,
  json,
  urlencoded,
  Request,
  Response,
  NextFunction,
} from "express";

import http from "http";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import cookieSession from "cookie-session";
import hpp from "hpp";
import HTTP_STATUS from "http-status-codes";
import "express-async-errors";
import { config } from "./config";

const SERVER_PORT = config.SERVER_PORT;

export class ChattyServer {
  private app: Application;

  constructor(app: Application) {
    this.app = app;
    // console.log(config);
    console.log(config.DATABASE_URL);
    
    
  }

  public start(): void {
    this.securityMiddleware(this.app);
    this.standardMiddleware(this.app);
    this.routeMiddleware(this.app);
    this.globalErrorHandler(this.app);
    this.startServer(this.app);
  }
  private securityMiddleware(app: Application): void {
    app.use(
      cookieSession({
        name: "session",
        keys: [config.SECRET_KEY_ONE, config.SECRET_KEY_TWO],
        maxAge: 24 * 7 * 360000,
        secure: config.NODE_ENV !== "development" ? true : false,
      })
    );
    app.use(hpp());
    app.use(helmet());
    app.use(
      cors({
        origin: "*", // http://localhost:3000
        credentials: true,
        optionsSuccessStatus: HTTP_STATUS.OK,
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      })
    );
  }

  private standardMiddleware(app: Application): void {
    app.use(compression());
    app.use(json({ limit: "50mb" }));
    app.use(urlencoded({ extended: true, limit: "50mb" }));
  }

  private routeMiddleware(app: Application): void {}

  private globalErrorHandler(app: Application): void {}

  private async startServer(app: Application): Promise<void> {
    try {
      const httpServer: http.Server = new http.Server(app);
      this.startHttpServer(httpServer);
    } catch (error) {}
  }

  private createSocketIO(httpServer: http.Server): void {}

  private startHttpServer(httpServer: http.Server): void {
    httpServer.listen(SERVER_PORT, () => {
      console.log(`Server is running on port ${SERVER_PORT}`);
    });
  }
}
