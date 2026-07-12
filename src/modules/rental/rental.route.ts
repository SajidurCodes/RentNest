import { Router } from "express";
import { Role } from "../../../generated/prisma/enums";
import { auth } from "../../middlewares/auth";
import { rentalController } from "./rental.controller";





const router = Router();


//Tenant 

router.post("/tenant",auth(Role.TENANT),rentalController.createRentalRequest);
router.get("/tenant",auth(Role.TENANT),rentalController.getMyRentalRequests);
router.get("/:rentalId",rentalController.getRentalRequestById);



//Landlord

router.get("/landlord/requests",auth(Role.LANDLORD),rentalController.getLandlordRentalRequests);
router.patch("/landlord/approve/:rentalId",auth(Role.LANDLORD),rentalController.approveRentalRequest);
router.patch("/landlord/reject/:rentalId",auth(Role.LANDLORD),rentalController.rejectRentalRequest);

export const rentalRoutes = router;