import { Router } from "express";
import auth from "../middlewares/auth.js";
import upload from "../middlewares/multer.js";
import { categoryImgController, createCategoryController, deleteCategoryController, getAllCategoriesController, getCategoriesCountController, getSingleCategoryController, getSubCategoriesCountController, imagesCategoryRemoveController, updateCategoryController } from "../controllers/category.controller.js";

const categoryRouter = Router();
categoryRouter.post("/upload-images", auth, upload.array('images'), categoryImgController);
categoryRouter.post("/create", auth, createCategoryController);
categoryRouter.get("/", getAllCategoriesController);
categoryRouter.get("/get/category-count", getCategoriesCountController);
categoryRouter.get("/get/sub-category-count", getSubCategoriesCountController);
categoryRouter.get("/:id", getSingleCategoryController);
categoryRouter.delete("/delete-images", auth, imagesCategoryRemoveController)
categoryRouter.delete("/:id", auth, deleteCategoryController)
categoryRouter.put("/:id", auth, updateCategoryController)



export default categoryRouter;