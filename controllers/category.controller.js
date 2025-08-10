import CategoryModel from '../models/category.model.js'
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';


// ********** Category Image Upload **********

cloudinary.config({
    // cloud_name: process.env.cloudinary_Config_Cloud_Name,
    // api_key: process.env.cloudinary_Config_Api_Key,
    // api_secret: process.env.cloudinary_Config_Api_Secret,
    // secure: true,
})

var imagesArray = [];

export async function categoryImgController(request, response) {
    try {
        imagesArray = [];

        const image = request.files;
      
        const options = {
            use_filename: true,
            unique_filename: false,
            overwrite: true,
        };

        for (let i = 0; i < image?.length; i++) {

            const img = await cloudinary.uploader.upload(
                image[i].path,
                options,
                function(error, result) {
                    imagesArray.push(result.secure_url);
                    fs.unlinkSync(`uploads/${image[i].filename}`);
                }
            );
            
        }

        return response.status(200).json({
            message: 'Images Uploaded Successfully',
            images: imagesArray,
            error: false,
            success: true,
        })
        
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false,
        });
    }
}

// ********** Create Category **********

export async function createCategoryController(request, response) {
    try {

        let category = new CategoryModel({
            name: request.body.name,
            images: imagesArray,
            parentId: request.body.parentId,
            parentCatName: request.body.parentCatName,
        });

        if (!category) {
            return response.status(400).json({
                message: 'Category Not Created',
                error: true,
                success: false,
            });
        }

        category = await category.save();

        imagesArray = [];

        return response.status(200).json({
            message: 'Category Created Successfully',
            category: category,
            error: false,
            success: true,
        });
        
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false,
        });
    }
}


// ********** Get All Categories **********

export async function getAllCategoriesController(request, response) {
    try {

        const categories = await CategoryModel.find();
        const categoryMap = {};

        if (!categories) {
            return response.status(400).json({
                message: 'Categories Not Found',
                error: true,
                success: false,
            });
        }

        categories.forEach(category => {
            categoryMap[category._id] = {
                ...category._doc,
                subCategories: []
            };
        });

        const rootCategories = [];

        categories.forEach(category => {
            if (category.parentId) {
                categoryMap[category.parentId].subCategories.push(categoryMap[category._id]);
            } else {
                rootCategories.push(categoryMap[category._id]);
            }
        });

        return response.status(200).json({
            message: 'Categories Found Successfully',
            data: rootCategories,
            error: false,
            success: true,
        });
        
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false,
        });
    }
}

// ********** Get Categories Count **********

export async function getCategoriesCountController(request, response) {
    try {
        
        const categoryCount = await CategoryModel.countDocuments({parentId: undefined});

        if (!categoryCount) {
            return response.status(400).json({
                message: 'Categories Count Not Found',
                error: true,
                success: false,
            });
        } else {
            return response.status(200).send({
                message: 'Categories Count Found Successfully',
                count: categoryCount,
                error: false,
                success: true,
            })
        }
        
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false,
        });
    }
}

// ********** Get Sub-Categories Count **********

export async function getSubCategoriesCountController(request, response) {
    try {
        
        const categories = await CategoryModel.find();

        if (!categories) {
            return response.status(400).json({
                message: 'Categories Not Found',
                error: true,
                success: false,
            });
        } else {
            const subCategoriesList = [];

            for (let cat of categories) {
                if (cat.parentId !== undefined) {
                    subCategoriesList.push(cat);
                }
            }

            return response.status(200).send({
                message: 'Sub-Categories Count Found Successfully',
                count: subCategoriesList.length,
                error: false,
                success: true,
            })
        }
        
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false,
        });
    }
}

// ********** Get single Category **********

export async function getSingleCategoryController(request, response) {
    try {
        
        const category = await CategoryModel.findById(request.params.id);

        if (!category) {
            return response.status(400).json({
                message: 'Category Not Found',
                error: true,
                success: false,
            });
        }

        return response.status(200).send({
            message: 'Category Found Successfully',
            category: category,
            error: false,
            success: true,
        })

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false,
        });
    }
}

// ********** Remove Images **********

export async function imagesCategoryRemoveController(request, response) {
    const imgUrl = request.query.img;
    const urlArray = imgUrl.split("/");
    
    const imageId = urlArray[urlArray.length - 1];
    const imageName = imageId.split(".")[0];
    
    if (imageName) {
        const result = await cloudinary.uploader.destroy(
            imageName,
            (err, res) => {
                // console.log(res, err);
            }
        )
    }
    
    if (response) {
        return response.status(200).json({
            message: "Image removed successfully",
            error: false,
            success: true,
        });
    }
    
}

// ********** Delete Category **********

export async function deleteCategoryController(request, response) {
    const category = await CategoryModel.findById(request.params.id);
    const images = category.images;

    let img = "";

    for (img of images) {
        const imgUrl = img;
        const urlArray = imgUrl.split("/");
        const imageId = urlArray[urlArray.length - 1];

        const image = imageId.split(".")[0];

        if (image) {
            cloudinary.uploader.destroy(image, (err, res) => {
                // console.log(res, err);
            });
        }
    }

    const subCategory = await CategoryModel.find({parentId: request.params.id});

    for (let i = 0; i < subCategory.length; i++) {
        
        const deletedSubCategory = await CategoryModel.findByIdAndDelete(subCategory[i]._id);

        if (!deletedSubCategory) {
            return response.status(400).json({
                message: 'Sub-Category Not Deleted',
                error: true,
                success: false,
            });
        }
    }

    const deletedCategory = await CategoryModel.findByIdAndDelete(request.params.id);

    if (!deletedCategory) {
        return response.status(400).json({
            message: 'Category Not Deleted',
            error: true,
            success: false,
        });
    }

    response.status(200).json({
        message: 'Category Deleted Successfully',
        error: false,
        success: true,
    });
    
}

// ********** Update Category **********

export async function updateCategoryController(request, response) {
    
    const category = await CategoryModel.findByIdAndUpdate(
        request.params.id,
        {
            name: request.body.name,
            images: imagesArray.length > 0 ? imagesArray[0] : request.body.images,
            parentId: request.body.parentId,
            parentCatName: request.body.parentCatName,
        },
        { new: true }
    );

    if (!category) {
        return response.status(400).json({
            message: 'Category Not Updated',
            error: true,
            success: false,
        });
    }

    imagesArray = [];

    return response.status(200).send({
        message: 'Category Updated Successfully',
        category: category,
        error: false,
        success: true,
    });

}