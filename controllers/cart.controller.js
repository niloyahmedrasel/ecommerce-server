import CartProductModel from "../models/cartproduct.model.js";
import UserModel from "../models/user.model.js";
import mongoose from "mongoose";

// ********** Add To Cart **********

export const addToCartItemController = async (request, response) => {
    try {

        const userId = request.body.userId;
        const productId = request.body.productId;

        if(!productId) {
            return response.status(400).send({
                message: "Product Id is required",
                error: true,
                success: false,
            })
        }

        const checkItemCart = await CartProductModel.findOne({
            userId: userId,
            productId: productId,
        });

        if (checkItemCart) {
            return response.status(400).send({
                message: "Product already added to cart",
                error: true,
                success: false,
            })
        }

        const cartItem = new CartProductModel({
            quantity: 1,
            userId: userId,
            productId: productId,
        });

        const save = await cartItem.save();

        const updateCartUser = await UserModel.updateOne(
            { _id: userId },
            { $push: { shopping_cart: productId } }
        )

        return response.status(200).send({
            message: "Product added to cart",
            error: false,
            success: true,
            data: save,
        })


    } catch (error) {
        response.status(500).send({
            message: error.message || error,
            error: true,
            success: false,
        })
    }
} 

// ********** Get Cart Item **********

export const getCartItemController = async (request, response) => {
    try {

        const userId = request.userId;

        if(!userId) {
            return response.status(400).send({
                message: "User Id is required",
                error: true,
                success: false,
            })
        }

        const cartItem = await CartProductModel.find({
            userId: userId,
        }).populate("productId");

        return response.status(200).send({
            message: "Cart Item",
            error: false,
            success: true,
            data: cartItem,
        })
        
    } catch (error) {
        response.status(500).send({
            message: error.message || error,
            error: true,
            success: false,
        })
    }
}

// ********** Update Cart Item **********

export const updateCartItemController = async (request, response) => {
    try {

        const userId = request.userId;
        const {_id, qty} = request.body;

        if (!_id || !qty) {
            return response.status(400).send({
                message: "Product Id and Quantity is required",
                error: true,
                success: false,
            })
        }

        const updateCartItem = await CartProductModel.updateOne(
            {
                _id: _id,
                userId: userId,
            },
            {
                quantity: qty,
            }
        )

        return response.status(200).send({
            message: "Cart Item Updated",
            data: updateCartItem,
            error: false,
            success: true,
        })
        
    } catch (error) {
        response.status(500).send({
            message: error.message || error,
            error: true,
            success: false,
        })
    }
}

// ********** Delete Cart Item **********

export const deleteCartItemController = async (request, response) => {
    try {
        const userId = request.userId;
        const { _id: cartItemId, productId } = request.body;

        // Validate input
        if (!cartItemId || !productId) {
            return response.status(400).json({
                message: "Cart item ID and product ID are required",
                error: true,
            });
        }

        // Start transaction session
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            // 1. Delete cart item
            const deleteResult = await CartProductModel.deleteOne({
                _id: cartItemId,
                userId: userId
            }).session(session);

            if (deleteResult.deletedCount === 0) {
                throw new Error("Cart item not found");
            }

            // 2. Update user's shopping cart
            const user = await UserModel.findById(userId).session(session);
            if (!user) throw new Error("User not found");

            // Convert to string for reliable comparison
            const productIdStr = productId.toString();
            
            user.shopping_cart = user.shopping_cart
                .map(id => id.toString())
                .filter(id => id !== productIdStr);

            await user.save({ session });

            await session.commitTransaction();
            
            return response.status(200).json({
                message: "Cart item deleted successfully",
                data: {
                    removedCartItem: cartItemId,
                    updatedCart: user.shopping_cart
                },
                success: true,
            });

        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
        }

    } catch (error) {
        console.error("Delete Cart Error:", error);
        return response.status(500).json({
            message: error.message || "Failed to delete cart item",
            error: true,
        });
    }
};