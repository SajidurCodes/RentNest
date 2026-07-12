import { Router } from "express";
import { Role } from "../../../generated/prisma/enums";
import { auth } from "../../middlewares/auth";
import { paymentController } from "./payment.controller";

const router = Router();


router.post("/create",auth(Role.TENANT),paymentController.createPayment);
router.post("/confirm",paymentController.confirmPayment);

//Payment History
router.get("/",auth(Role.TENANT),paymentController.getMyPayments);

// Single Payment Details
router.get("/:paymentId",auth(Role.TENANT),paymentController.getPaymentById);

export const paymentRoutes = router;