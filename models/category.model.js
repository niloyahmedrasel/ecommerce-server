import mongoose from "mongoose";

const categorySchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    images: {
        type: [String],
        default: []
    },
    parentCatName: {
        type: String,
        trim: true
    },
    parentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        default: null
    }

},{
    timestamps: true,
});

const CategoryModel = mongoose.model('Category', categorySchema);
export default CategoryModel;