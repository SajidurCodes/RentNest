import { Router } from "express";
import { Role } from "../../../generated/prisma/enums";
import { auth } from "../../middlewares/auth";
import { authController } from "./auth.controller";



const router = Router();

router.post("/register",authController.registerUser);

router.post("/login",authController.loginUser);

router.get("/me",auth(Role.ADMIN, Role.LANDLORD, Role.TENANT),authController.getMe);

export const authRoutes = router;