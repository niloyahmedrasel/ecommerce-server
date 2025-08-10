import { request, response } from "express";
import WishListModel from "../models/wishList.model.js";


// ********** Add To WishList **********

export const addToWishListController = async (request, response) => {
    try {

        const userId = request.body.userId;
        const {
            productId,
            productTitle,
            image, 
            price,
            oldPrice,
            brand,
            discount,
        } = request.body;

        const item = await WishListModel.findOne({
            userId: userId,
            productId: productId,
        })

        if (item) {
            return response.status(400).json({
                message: "Product already added to Wish List"
            })
        }

        const newItem = new WishListModel({
            productId,
            productTitle,
            image, 
            price,
            oldPrice,
            brand,
            discount,
            userId
        })

        const savedItem = await newItem.save();

        response.status(200).send({
            message: "Product added to Wish List",
            product: savedItem,
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

// ********** Get WishList **********

export const getWishListController = async (request, response) => {
    try {

        const userId = request.body.userId;
        
        const wishListItems = await WishListModel.find({
            userId: userId
        })

        if (wishListItems.length === 0) {
            return response.status(400).json({
                message: "Wish List is empty",
                error: true,
                success: false
            })
        }

        response.status(200).send({
            message: "Wish List",
            wishListItems,
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

// ********** Delete WishList **********

export const deleteWishListController = async (request, response) => {
    try {

        const wishListItem = await WishListModel.findById(request.params.id)

        if (!wishListItem) {
            return response.status(400).json({
                message: "Item not found",
                error: true,
                success: false
            })
        }

        const deletedItem = await WishListModel.findByIdAndDelete(request.params.id)

        if (!deletedItem) {
            return response.status(400).json({
                message: "Item is not deleted",
                error: true,
                success: false
            })
        }

        response.status(200).send({
            message: "Item deleted",
            item: deletedItem,
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