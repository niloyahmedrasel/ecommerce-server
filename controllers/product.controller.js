import ProductModel from "../models/product.model.js";

import { v2 as cloudinary } from "cloudinary";
import fs from "fs";


// ********** Product Image Upload **********

cloudinary.config({
  cloud_name: process.env.cloudinary_Config_Cloud_Name,
  api_key: process.env.cloudinary_Config_Api_Key,
  api_secret: process.env.cloudinary_Config_Api_Secret,
  secure: true,
})


export async function productImgController(request, response) {
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

// ********** Create Product **********

export async function createProductController(request, response) {
  try {
    let imagesArray = [];
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

    let product = new ProductModel({
      name: request.body.name,
      description: request.body.description,
      images: imagesArray,
      brand: request.body.brand,
      price: request.body.price,
      oldPrice: request.body.oldPrice,
      catName: request.body.catName,
      catId: request.body.catId,
      subCatName: request.body.subCatName,
      subCatId: request.body.subCatId,
      countInStock: request.body.countInStock,
      category: request.body.category,
      isFeatured: request.body.isFeatured,
      discount: request.body.discount,
      product_Storage: request.body.product_Storage,
      product_CPU: request.body.product_CPU,
      product_RAM: request.body.product_RAM,
    })

    product = await product.save();

    if (!product) {
      return response.status(400).json({
        message: 'Product Not Created',
        error: true,
        success: false,
      });
    }

    imagesArray = [];

    return response.status(200).json({
      message: 'Product Created Successfully',
      product: product,
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

// ********** Get All Products **********

export async function getAllProductsController(request, response) {
  try {

    const page = parseInt(request.query.page) || 1;
    const perPage = parseInt(request.query.perPage);
    const totalPosts = await ProductModel.countDocuments();
    const totalPages = Math.ceil(totalPosts / perPage);

    if (page > totalPages) {
      return response.status(400).json({
        message: 'Page Not Found',
        error: true,
        success: false,
      });
    }

    const products = await ProductModel.find()
    .populate('category')
    .skip((page - 1) * perPage)
    .limit(perPage)
    .exec()
    ;

    if (!products) {
      return response.status(400).json({
        message: 'Products Not Found',
        error: true,
        success: false,
      });
    }



    return response.status(200).json({
      message: 'Products Found Successfully',
      products: products,
      totalPages: totalPages,
      page: page,
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

// ********** Get All Products By Category ID **********

export async function getAllProductsByCatController(request, response) {
    try {
  
      const page = parseInt(request.query.page) || 1;
      const perPage = parseInt(request.query.perPage) || 10000;
      const catId= request.params.id

      const totalPosts = await ProductModel.countDocuments();
      const totalPages = Math.ceil(totalPosts / perPage);
  
      if (page > totalPages) {
        return response.status(400).json({
          message: 'Page Not Found',
          error: true,
          success: false,
        });
      }
  
      const products = await ProductModel.find({
        catId: request.params.id,
      }).populate('category').skip((page - 1) * perPage).limit(perPage).exec();
  
      if (!products) {
        return response.status(400).json({
          message: 'Products Not Found',
          error: true,
          success: false,
        });
      }
  
  
  
      return response.status(200).json({
        message: 'Products Found Successfully',
        products: products,
        totalPages: totalPages,
        page: page,
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

// ********** Get All Products By Name **********

export async function getAllProductsByNameController(request, response) {
    try {
  
        const page = parseInt(request.query.page) || 1;
        const perPage = parseInt(request.query.perPage) || 10000;
        const catName = request.query.catName;

        const totalPosts = await ProductModel.countDocuments();
        const totalPages = Math.ceil(totalPosts / perPage);
    
        if (page > totalPages) {
          return response.status(400).json({
            message: 'Page Not Found',
            error: true,
            success: false,
          });
        }
    
        const products = await ProductModel.find({
            catName: request.query.catName
        }).populate('category').skip((page - 1) * perPage).limit(perPage).exec();
    
        if (!products) {
          return response.status(400).json({
            message: 'Products Not Found',
            error: true,
            success: false,
          });
        }
    
        return response.status(200).json({
          message: 'Products Found Successfully',
          products: products,
          totalPages: totalPages,
          page: page,
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


// ********** Get All Products By Sub-Category ID **********

export async function getAllProductsBySubCatController(request, response) {
  try {

    const page = parseInt(request.query.page) || 1;
    const perPage = parseInt(request.query.perPage) || 10000;
    const catId= request.params.id

    const totalPosts = await ProductModel.countDocuments();
    const totalPages = Math.ceil(totalPosts / perPage);

    if (page > totalPages) {
      return response.status(400).json({
        message: 'Page Not Found',
        error: true,
        success: false,
      });
    }

    const products = await ProductModel.find({
      subCatId: request.params.id,
    }).populate('category').skip((page - 1) * perPage).limit(perPage).exec();

    if (!products) {
      return response.status(400).json({
        message: 'Products Not Found',
        error: true,
        success: false,
      });
    }



    return response.status(200).json({
      message: 'Products Found Successfully',
      products: products,
      totalPages: totalPages,
      page: page,
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

// ********** Get All Products By Sub-Category Name **********

export async function getAllProductsBySubCatNameController(request, response) {
  try {

      const page = parseInt(request.query.page) || 1;
      const perPage = parseInt(request.query.perPage) || 10000;
      const catName = request.query.catName;

      const totalPosts = await ProductModel.countDocuments();
      const totalPages = Math.ceil(totalPosts / perPage);
  
      if (page > totalPages) {
        return response.status(400).json({
          message: 'Page Not Found',
          error: true,
          success: false,
        });
      }
  
      const products = await ProductModel.find({
        subCatName: request.query.subCatName
      }).populate('category').skip((page - 1) * perPage).limit(perPage).exec();
  
      if (!products) {
        return response.status(400).json({
          message: 'Products Not Found',
          error: true,
          success: false,
        });
      }
  
      return response.status(200).json({
        message: 'Products Found Successfully',
        products: products,
        totalPages: totalPages,
        page: page,
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

// ********** Filter By Price **********

export async function filterByPriceController(request, response) {
  try {

    let productList = [];

    if (request.query.catId !== "" && request.query.catId !== undefined) {
      const productListArray = await ProductModel.find({
        catId: request.query.catId,
      }).populate('category');

      productList = productListArray
    }

    if (request.query.subCatId !== "" && request.query.subCatId !== undefined) {
      const productListArray = await ProductModel.find({
        subCatId: request.query.subCatId,
      }).populate('category');

      productList = productListArray
    }

    const filteredProducts = productList.filter((product) => {
      if (request.query.minPrice &&  product.price < parseInt(+request.query.minPrice)) {
        return false;
      }
      if (request.query.minPrice && product.price > parseInt(+request.query.maxPrice)) {
        return false;
      }
      return true;
    })

    return response.status(200).json({
      message: 'Products Found Successfully',
      products: filteredProducts,
      totalPages: 0,
      page: 0,
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

// ********** Get All Products Count **********

export async function getAllProductsCountController(request, response) {
  try {

    const productsCount = await ProductModel.countDocuments();

    if (!productsCount) {
      return response.status(400).json({
        message: 'Products Not Found',
        error: true,
        success: false,
      });
    }

    return response.status(200).json({
      message: 'Products Count Found Successfully',
      productsCount: productsCount,
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

// ********** Get Featured Product **********

export async function getFeaturedProductController(request, response) {
  try {

    const products = await ProductModel.find({
      isFeatured: true,
    }).populate('category');

    if (!products) {
      return response.status(400).json({
        message: 'Products Not Found',
        error: true,
        success: false,
      });
    }
    
    return response.status(200).json({
      message: 'Products Found Successfully',
      products: products,
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

// ********** Delete Product **********

export async function deleteProductController(request, response) {
  try {

    const product = await ProductModel.findById(request.params.id).populate('category');
    
    if (!product) {
      return response.status(400).json({
        message: 'Product Not Found',
        error: true,
        success: false,
      });
    }

    const images = product.images;

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

    const deletedProduct = await ProductModel.findByIdAndDelete(request.params.id);

    if (!deletedProduct) {
      return response.status(400).json({
        message: 'Product Not Deleted',
        error: true,
        success: false,
      });
    }

    return response.status(200).json({
      message: 'Product Deleted Successfully',
      product: deletedProduct,
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

// ********** Get Single Product **********

export async function getSingleProductController(request, response) {
  try {

    const product = await ProductModel.findById(request.params.id).populate('category');

    if (!product) {
      return response.status(400).json({
        message: 'Product Not Found',
        error: true,
        success: false,
      });
    }

    return response.status(200).json({
      message: 'Product Found Successfully',
      product: product,
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

export async function productImagesRemoveController(request, response) {
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

// ********** Update Product **********

export async function updateProductController(request, response) {
  try {

    console.log(request.body);
    let imagesArray = [];
    const image = request.files;

    const options = {
      use_filename: true,
      unique_filename: false,
      overwrite: true,
    };

    // upload new images if provided
    if (image && image.length > 0) {
      for (let i = 0; i < image.length; i++) {
        const result = await cloudinary.uploader.upload(image[i].path, options);
        imagesArray.push(result.secure_url);
        fs.unlinkSync(`uploads/${image[i].filename}`);
      }
    }

    // build update object
    const updateData = {
      name: request.body.name,
      description: request.body.description,
      brand: request.body.brand,
      price: request.body.price,
      oldPrice: request.body.oldPrice,
      catName: request.body.catName,
      catId: request.body.catId,
      subCatName: request.body.subCatName,
      subCatId: request.body.subCatId,
      countInStock: request.body.countInStock,
      category: request.body.category,
      isFeatured: request.body.isFeatured,
      discount: request.body.discount,
      product_Storage: request.body.product_Storage,
      product_CPU: request.body.product_CPU,
      product_RAM: request.body.product_RAM,
    };

    // only update images if new ones were uploaded
    if (imagesArray.length > 0) {
      updateData.images = imagesArray;
    }

    const product = await ProductModel.findByIdAndUpdate(
      request.params.id,
      updateData,
      { new: true } // return updated doc
    );

    if (!product) {
      return response.status(400).json({
        message: 'Product Not Updated',
        error: true,
        success: false,
      });
    }

    return response.status(200).json({
      message: 'Product Updated Successfully',
      product,
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


