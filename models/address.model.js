import mongoose from "mongoose";

const addressSchema = mongoose.Schema({
    address_line : {
        type: String,
        default: "",
    },
    city: {
        type: String,
        default: "",
    },
    state: {
        type: String,
        default: "",
    },
    pincode: {
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
