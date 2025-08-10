import mongoose from "mongoose";

const productSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        // unique: true
    },
    description: {
        type: String,
        required: true,
    },
    images: [
        {
            type: String,
            required: true,
        },
    ],
    brand: {
        type: String,
        default: '',
    },
    price: {
        type: Number,
        default: 0,
    },
    oldPrice: {
        type: Number,
        default: 0,
    },
    catName: {
        type: String,
        default: '',
    },
    catId: {
        type: String,
        default: '',
    },
    subCatName: {
        type: String,
        default: '',
    },
    subCatId: {
        type: String,
        default: '',
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        // required: true,
        index: true,
    },
    countInStock: {
        type: Number,
        required: true,
    },
    isFeatured: {
        type: Boolean,
        default: false,
    },
    discount: {
        type: Number,
        default: 0,
    },
    product_RAM: {
        type: String,
        default: '',
    },
    product_Storage: {
        type: String,
        default: '',
    },
    product_CPU: {
        type: String,
        default: '',
    },

    dateCreated: {
        type: Date,
        default: Date.now,
    },
},{
    timestamps: true,
})

const ProductModel = mongoose.model("Product", productSchema);

export default ProductModel;