import mongoose from "mongoose";

const cartProductSchema = mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
    },
    quantity: {
        type: Number,
        default: 1,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
    },
}, {timestamps: true}
);

const CartProductModel = mongoose.model("cartProduct", cartProductSchema);

export default CartProductModel;