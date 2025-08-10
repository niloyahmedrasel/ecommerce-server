import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    userId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    orderId : {
        type: String,
        required: true,
        unique: true,
    },
    productId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
    },
    product_details : {
        type: String,
        image : Array,
    },
    paymentId : {
        type: String,
        default: '',
    },
    payment_status : {
        type: String,
        default: '',
    },
    delivery_address : {
        type: mongoose.Schema.ObjectId,
        default: 'address',
    },
    subTotalAmt : {
        type: Number,
        default: 0,
    },
    totalAmt : {
        type: Number,
        default: 0,
    },
}, {timestamps: true}
);

const OrderModel = mongoose.model('Order', orderSchema);
export default OrderModel;