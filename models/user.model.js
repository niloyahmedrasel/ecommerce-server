import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Provide a name"],
    },
    email: {
        type: String,
        required: [true, "Provide an email"],
        unique: true,
    },
    password: {
        type: String,
        required: [true, "Provide a password"],
        minLength: [6, "Password must be at least 6 characters"],
    },
    avatar: {
        type: String,
        default: "",
    },
    mobile: {
        type: Number,
        default: null,
    },
    verify_email: {
        type: Boolean,
        default: false,
    },
    last_login_date: {
        type: Date,
        default: "",
    },
    accessToken: {
        type: String,
        default: "",
    },
    accessToken: {
        type: String,
        default: "",
    },
    status: {
        type: String,
        enum: ["Active", "Inactive", "Suspended"],
        default: "Active",
    },
    address_details:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "address",
    },
    shopping_cart: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "cartProduct",
        }
    ],
    orderHistory: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "order",
        }
    ],
    // forgot_password_otp: {
    //     type: String,
    //     default: null,
    // },
    // forgot_password_otp_expiry: {
    //     type: Date,
    //     default: "",
    // },
    otp: {
        type: String,
    },
    otpExpires: {
        type: Date,
    },
    role: {
        type: String,
        enum: ["Admin", "User"],
        default: "User",
    },
},{ timestamps: true, }
);

const UserModel = mongoose.model("User", userSchema);

export default UserModel;