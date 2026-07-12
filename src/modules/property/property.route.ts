import { Router } from "express";
import { Role } from "../../../generated/prisma/enums";
import { auth } from "../../middlewares/auth";
import { propertyController } from "./property.controller";


const router = Router();


//Public

router.get("/", propertyController.getAllProperties);
router.get("/:propertyId", propertyController.getPropertyById);


//Landlord

router.post("/",auth(Role.LANDLORD),propertyController.createProperty);
router.get("/my/properties",auth(Role.LANDLORD),propertyController.getMyProperties);
router.patch("/:propertyId",auth(Role.LANDLORD),propertyController.updateProperty);
router.delete("/:propertyId",auth(Role.LANDLORD),propertyController.deleteProperty);

export const propertyRoutes = router;