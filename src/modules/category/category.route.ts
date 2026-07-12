import { Router } from "express";
import { Role } from "../../../generated/prisma/enums";
import { auth } from "../../middlewares/auth";
import { categoryController } from "./category.controller";




const router=Router();




router.post("/",auth(Role.ADMIN),categoryController.createCategory);
router.get("/",categoryController.getAllCategories);
router.get("/:categoryId",categoryController.getCategoryById);
router.patch("/:categoryId",auth(Role.ADMIN),categoryController.updateCategory);
router.delete("/:categoryId",auth(Role.ADMIN),categoryController.deleteCategory);

export const categoryRoutes=router;