import express, { Application, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { authRoutes } from "./modules/auth/auth.route";
import { userRoutes } from "./modules/user/user.route";
import { globalErrorHandler } from "./middlewares/globalErrorHandler";
import { notFound } from "./middlewares/notFound";
import { categoryRoutes } from "./modules/category/category.route";
import { propertyRoutes } from "./modules/property/property.route";
import { rentalRoutes } from "./modules/rental/rental.route";
import { reviewRoutes } from "./modules/review/review.route";
import config from "./config";

const app: Application = express();

app.use(cors({
    origin : config.app_url,
    credentials : true,
}))

app.use("/api/payments/confirm", express.raw({ type: 'application/json' }))
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



app.get("/", (req: Request, res: Response) => {
  res.json({success: true,message: "🏠 Welcome to RentNest API!!!!🚀🚀🚀",});
});


app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/properties", propertyRoutes);
app.use("/api/rentals", rentalRoutes);
app.use("/api/reviews", reviewRoutes);

// app.use("/api/payments", paymentRoutes);




// Middlewares
app.use(globalErrorHandler);

app.use(notFound);

export default app;