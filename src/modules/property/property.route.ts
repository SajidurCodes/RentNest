import { Router } from "express";
import { Role } from "../../../generated/prisma/enums";
import { auth } from "../../middlewares/auth";
import { propertyController } from "./property.controller";


const router = Router();


//Public

router.get("/", propertyController.getAllProperties);
router.get("/:propertyId", propertyController.getPropertyById);


//Landlord

router.post("/landlord",auth(Role.LANDLORD),propertyController.createProperty);
router.get("/landlord/my/properties/:landlordId",auth(Role.LANDLORD),propertyController.getMyProperties);
router.patch("/landlord/:propertyId",auth(Role.LANDLORD),propertyController.updateProperty);
router.delete("/landlord/:propertyId",auth(Role.LANDLORD),propertyController.deleteProperty);

export const propertyRoutes = router;