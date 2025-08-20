import { Router } from "express";
import auth from "../middlewares/auth.js";
import upload from "../middlewares/multer.js";
import { createProductController, deleteProductController, filterByPriceController, getAllProductsByCatController, getAllProductsByNameController, getAllProductsBySubCatController, getAllProductsBySubCatNameController, getAllProductsController, getAllProductsCountController, getFeaturedProductController, getSingleProductController, productImagesRemoveController, productImgController, updateProductController } from "../controllers/product.controller.js";

const productRouter = Router();
productRouter.post('/upload-images', auth, upload.array('images'), productImgController)
productRouter.post('/create', auth,upload.array('images'), createProductController)
productRouter.get('/all-products',  getAllProductsController)
productRouter.get('/category-products/:id', getAllProductsByCatController)
productRouter.get('/category-products', getAllProductsByNameController)
productRouter.get('/sub-category-products/:id', getAllProductsBySubCatController)
productRouter.get('/sub-category-products', getAllProductsBySubCatNameController)
productRouter.get('/products-by-price', filterByPriceController)
productRouter.get('/products-count', getAllProductsCountController)
productRouter.get('/featured-products', getFeaturedProductController)
productRouter.delete('/:id', deleteProductController)
productRouter.get('/:id', getSingleProductController)
productRouter.delete("/delete-images", auth, productImagesRemoveController)
productRouter.delete("/update-product/:id", auth, updateProductController)



export default productRouter;