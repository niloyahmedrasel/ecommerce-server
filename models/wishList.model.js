import mongoose from "mongoose";

const cartProductSchema = mongoose.Schema({
    productId: {
        type: String,
        required: true,
    },
    userId: {
        type: String,
        required: true,
    },
    productTitle: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    }, 
    price: {
        type: Number,
        required: true,
    },
    oldPrice: {
        type: Number,
        required: true,
    },
    brand: {
        type: String,
        required: true,
    },
    discount: {
        type: Number,
        required: true,
    },
},{
    timestamps: true,
});

const WishListModel = mongoose.model("wishList", cartProductSchema);

export default WishListModel;