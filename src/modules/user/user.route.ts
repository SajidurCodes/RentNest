import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { userController } from "./user.controller";
import { Role } from "../../../generated/prisma/enums";





const router = Router();



router.get("/me",auth(Role.ADMIN, Role.LANDLORD, Role.TENANT),userController.getMyProfile);

router.patch("/me",auth(Role.ADMIN, Role.LANDLORD, Role.TENANT),userController.updateProfile);


router.get("/",auth(Role.ADMIN),userController.getAllUsers);

router.patch("/ban/:userId",auth(Role.ADMIN),userController.banUser);

router.patch("/unban/:userId",auth(Role.ADMIN),userController.unbanUser);




export const userRoutes = router;