import {Router} from "express";
import auth from "../middlewares/auth.js";
import { addToWishListController, deleteWishListController, getWishListController } from "../controllers/wishList.controller.js";

const wishListRouter = Router();
wishListRouter.post("/add", auth, addToWishListController)
wishListRouter.get("/", auth, getWishListController)
wishListRouter.delete("/:id", auth, deleteWishListController)

export default wishListRouter;