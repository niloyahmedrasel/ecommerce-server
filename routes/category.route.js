import { Router } from "express";
import auth from "../middlewares/auth.js";
import upload from "../middlewares/multer.js";
import { createCategoryController, deleteCategoryController, getAllCategoriesController, getCategoriesCountController, getSingleCategoryController, getSubCategoriesCountController, imagesCategoryRemoveController, updateCategoryController } from "../controllers/category.controller.js";

const categoryRouter = Router();
categoryRouter.post("/upload-images", auth, upload.array('images'), createCategoryController);
// categoryRouter.post("/create", auth, createCategoryController);
categoryRouter.get("/", getAllCategoriesController);
categoryRouter.get("/category-count", getCategoriesCountController);
categoryRouter.get("/sub-category-count", getSubCategoriesCountController);
categoryRouter.get("/:id", getSingleCategoryController);
categoryRouter.delete("/delete-images", auth, imagesCategoryRemoveController)
categoryRouter.delete("/:id", auth, deleteCategoryController)
categoryRouter.put("/:id", auth, updateCategoryController)



export default categoryRouter;