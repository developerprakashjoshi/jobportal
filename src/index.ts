import "./module-alias";
import "reflect-metadata";
import express, { Application, Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import bodyParser from "body-parser";
import jwt from "jsonwebtoken";
import passportJwt from "@middlewares/passport-jwt.middleware";

dotenv.config();

if (process.env.NODE_ENV === 'production') {
  dotenv.config({ path: '.env.production' });
  console.log("Connect to production environment");
} else if (process.env.NODE_ENV === 'development') {
  dotenv.config({ path: '.env.development' });
  console.log("Connect to development environment");
}else if (process.env.NODE_ENV === 'stage') {
  dotenv.config({ path: '.env.stage' });
  console.log("Connect to stage environment");
}else{
  console.log("Cannot connect to environment");
}


import AppDataSource from "@config/mongoose";
import roleRoutes from "@routes/role.route";
import userRoutes from "@routes/user.route";
import storageRoutes from "@routes/storage.route";
import jobRoute from  '@routes/job.route';
import companyRoute from '@routes/company.route'
import countryRoutes from '@routes/country.route';
import stateRoutes from '@routes/state.route';
import cityRoutes from '@routes/city.route';
import interviewRoute from '@routes/interview.route'
import notificationRoute from  '@routes/notification.route';
import messageRoute from  '@routes/message.route';
import reviewRoute from '@routes/review.route'
import recruiterRoute from '@routes/recruiter.route'
import applyRoute from '@routes/apply.route'
import chatRoute from '@routes/chat.route'
import messagesRoute from '@routes/messages.route'
import courseRoute from '@routes/course.route'
import payRange from '@routes/payrange.route';
import tweetRoute from '@routes/tweet.route';
import favouriteRoute from '@routes/favourite.route';
import searchRoute from '@routes/search.route';

import { errorHandler, notFound } from "@libs/error.handler";

const app: Application = express();
const allowedOrigins = (process.env.ALLOWED_ORIGINS || '').split(',');
const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    if (origin && allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
};

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

morgan.token("user-type", (req: Request, res: Response) => {
  return req.headers["user-type"] as string;
});

morgan.token("req-body", (req: Request) => {
  return JSON.stringify(req.body);
});

const logFormat =
  ":method :url :status :res[content-length] - :response-time ms\n" +
  "User Type: :user-type\n" +
  "Request Body: :req-body\n";
app.use(morgan(logFormat));

app.get("/api/demo", (req: Request, res: Response) => {
  console.log(req.isAuthenticated());
  const jwtPayload = { id: 1 };
  const token = jwt.sign(jwtPayload, process.env.JWT_SECRET_KEY || "");
  res.json({ token: token });
});

app.get("/api/test", (req: Request, res: Response) => {
  res.json("test");
});

app.use("/api/v1/role", roleRoutes);
app.use("/api/v1/storage", storageRoutes);
app.use("/api/v1/user", userRoutes);
app.use('/api/v1/job',jobRoute);
app.use('/api/v1/company',companyRoute)
app.use('/api/v1/country',countryRoutes)
app.use('/api/v1/state',stateRoutes);
app.use('/api/v1/city',cityRoutes);
app.use('/api/v1/interview',interviewRoute);
app.use('/api/v1/notification',notificationRoute);
app.use('/api/v1/message',messageRoute);
app.use('/api/v1/review',reviewRoute);
app.use('/api/v1/recruiter',recruiterRoute);
app.use('/api/v1/apply',applyRoute);
app.use('/api/v1/chat',chatRoute);
app.use('/api/v1/messages',messagesRoute);
app.use('/api/v1/course',courseRoute);
app.use('/api/v1/payRange',payRange);
app.use('/api/v1/tweet',tweetRoute);
app.use('/api/v1/favourite',favouriteRoute);
app.use('/api/v1/search',searchRoute);


app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    statusCode: 200,
    message: "Hello from server! server is running",
  });
});
app.use(notFound);
app.use(errorHandler);

// Handle connection events
AppDataSource.on(
  "error",
  console.error.bind(console, "MongoDB connection error:")
);
AppDataSource.once("open", () => {
  console.log("Connected to MongoDB");

  app.listen(process.env.APP_PORT, () => {
    console.log(
      `Server started with port ${process.env.APP_HOST}:${process.env.APP_PORT}`
    );
  });
});
