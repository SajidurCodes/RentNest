import express, { Application, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { authRoutes } from "./modules/auth/auth.route";
import { userRoutes } from "./modules/user/user.route";
import { globalErrorHandler } from "./middlewares/globalErrorHandler";
import { notFound } from "./middlewares/notFound";

const app: Application = express();

app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



app.get("/", (req: Request, res: Response) => {
  res.json({success: true,message: "🏠 Welcome to RentNest API!!!!🚀🚀🚀",});
});


app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
// app.use("/api/categories", categoryRoutes);
// app.use("/api/properties", propertyRoutes);
// app.use("/api/rentals", rentalRoutes);
// app.use("/api/reviews", reviewRoutes);
// app.use("/api/admin", adminRoutes);
// app.use("/api/payments", paymentRoutes);




// Middlewares
app.use(globalErrorHandler);

app.use(notFound);

export default app;