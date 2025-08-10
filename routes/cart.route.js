import { Router } from "express";
import auth from "../middlewares/auth.js";
import { addToCartItemController, deleteCartItemController, getCartItemController, updateCartItemController } from "../controllers/cart.controller.js";

const cartRouter = Router();

cartRouter.post("/add", auth, addToCartItemController)
cartRouter.get("/get", auth, getCartItemController)
cartRouter.put("/update-quantity", auth, updateCartItemController)
cartRouter.delete("/delete-item", auth, deleteCartItemController)



export default cartRouter;