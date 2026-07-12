import { Router } from "express";
import { Role } from "../../../generated/prisma/enums";
import { auth } from "../../middlewares/auth";
import { rentalController } from "./rental.controller";





const router = Router();


//Tenant 

router.post("/",auth(Role.TENANT),rentalController.createRentalRequest);
router.get("/",auth(Role.TENANT),rentalController.getMyRentalRequests);
router.get("/:rentalId",auth(Role.TENANT, Role.LANDLORD, Role.ADMIN),rentalController.getRentalRequestById);


//Landlord

router.get("/landlord/requests",auth(Role.LANDLORD),rentalController.getLandlordRentalRequests);
router.patch("/:rentalId/approve",auth(Role.LANDLORD),rentalController.approveRentalRequest);
router.patch("/:rentalId/reject",auth(Role.LANDLORD),rentalController.rejectRentalRequest);

export const rentalRoutes = router;