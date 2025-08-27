import mongoose from "mongoose";

const addressSchema = mongoose.Schema({
    address: {
        type: String,
        default: "",
    },
    city: {
        type: String,
        default: "",
    },
    country:{
        type: String,
        default: "",
    },
    state: {
        type: String,
        default: "",
    },
    zipCode: {
        type: String,
    },
    mobile: {
        type: Number,
        default: "",
    },
    status: {
        type: Boolean,
        default: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "",
    },
}, {timestamps: true}
);

const AddressModel = mongoose.model("address", addressSchema);
export default AddressModel;
