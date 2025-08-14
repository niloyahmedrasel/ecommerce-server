import UserModel from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import sendEmailFunc from "../config/emailService.js";
import verifyEmailTemplate from "../utils/verifyEmailTemplate.js";
import crypto from 'crypto';
import generateAccessToken from "../utils/generateAccessToken.js";
import generateRefreshToken from "../utils/generateRefreshToken.js";
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

// ********** Register User **********
export async function registerUserController(request, response) {
    try {
        let user;

        const { name, email, password } = request.body;
        if (!name || !email || !password) {
            return response.status(400).json({
                message: "All fields are required",
                error: true,
                success: false,
            });
        }
        
        user = await UserModel.findOne({ email:email });
        if (user) {
            return response.status(409).json({
                message: "User already exists",
                error: true,
                success: false,
            });
        }

        // const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
        const verifyCode = crypto.randomInt(100000, 999999).toString();

        const salt = await bcryptjs.genSalt(10);
        const hashPassword = await bcryptjs.hash(password, salt);        

        user = new UserModel({
            name: name,
            email: email,
            password: hashPassword,
            otp: verifyCode,
            otpExpires: Date.now() + 600000,
        })

        await user.save(); 

        const verifyEmail = await sendEmailFunc(
            email, // to
            "Verify Email from SHINE IIT", // subject
            "", // text
            verifyEmailTemplate(name, verifyCode) // html
          );

        // Create a JWT token for varification purpose
        const token = jwt.sign(
            { userId: user._id, email: user.email }, 
            process.env.JSON_WEB_TOKEN_SECRET_KEY
        );

        return response.status(200).json({
            success: true,
            message: "User Registered successfully",
            token: token,
            error: false,
        })

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false,
        });   
    }
}

// ********** Verify User **********
export async function verifyEmailController(request, response) {
    try {

        const { email, otp } = request.body;
        const user = await UserModel.findOne({ email: email });

        if (!user) {
            return response.status(404).json({
                message: "User not found",
                error: true,
                success: false,
            });
        }

        const isCodeValid = user.otp === otp;
        const isCodeExpired = user.otpExpires > Date.now();

        if (isCodeValid && isCodeExpired) {
            user.verify_email = true;
            user.otp = null;
            user.otpExpires = null;
            await user.save();
            return response.status(200).json({
                message: "Email verified successfully",
                error: false,
                success: true,
            });
        } else if (!isCodeValid)  {
            return response.status(400).json({
                message: "Invalid OTP",
                error: true,
                success: false,
            });
        } else {
            return response.status(400).json({
                message: "OTP expired",
                error: true,
                success: false,
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
// ********** Login User **********

export async function loginUserController(request, response) {
    try {
        const {email, password} = request.body;
        const user = await UserModel.findOne({email: email});
    
        if (!user) {
            return response.status(404).json({
                message: "User not Registered",
                error: true,
                success: false,
            });
        }
    
        if (user.status !=='Active') {
            return response.status(400).json({
                message: "Contact Admin",
                error: true,
                success: false,
            });
        }

        if (user.verify_email !== true) {
            return response.status(400).json({
                message: "Verify your email",
                error: true,
                success: false,
            });
        }
    
        const checkPassword = await bcryptjs.compare(password, user.password);
    
        if (!checkPassword) {
            return response.status(400).json({
                message: "Invalid Password",
                error: true,
                success: false,
            });
        }
    
        const accessToken = await generateAccessToken(user._id);
        const refreshToken = await generateRefreshToken(user._id);
    
        const updateUser = await UserModel.findByIdAndUpdate(
            user?._id,
            {
                last_login_date: Date.now(),
            },
        );
    
        const cookiesOption = {
            httpOnly: true,
            secure: true,
            sameSite: "None",
        }
    
        response.cookie("accessToken", accessToken, cookiesOption);
        response.cookie("refreshToken", refreshToken, cookiesOption);
    
        return response.status(200).json({
            message: "User logged in successfully",
            error: false,
            success: true,
            data: {
                accessToken,
                refreshToken,
            }
        });
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false,
        }); 
    }
}
// ********** Logout User **********

export async function logoutUserController(request, response) {
    try {
        const userId = request.userId;
        
        const cookiesOption = {
            httpOnly: true,
            secure: true,
            sameSite: "None",
        }

        response.clearCookie("accessToken", cookiesOption);
        response.clearCookie("refreshToken", cookiesOption);

        const removeRefreshToken = await UserModel.findByIdAndUpdate(
            userId,
            {
                refresh_token: "",
            },
        )

        return response.status(200).json({
            message: "User logged out successfully",
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

// ********** User Avatar Upload **********

cloudinary.config({
    // cloud_name: process.env.cloudinary_Config_Cloud_Name,
    // api_key: process.env.cloudinary_Config_Api_Key,
    // api_secret: process.env.cloudinary_Config_Api_Secret,
    // secure: true,
})

let imagesArray = [];

export async function avatarUserController(request, response) {
    try {
        imagesArray = [];

        const userId = request.userId;
        const image = request.files;

        const user = await UserModel.findById( {_id: userId} );

        // ********** First remove the previous image **********
        
        if (!user) {
            return response.status(404).json({
                message: "User not found",
                error: true,
                success: false,
            });
        }

        const imgUrl = user.avatar;
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

        user.avatar = imagesArray[0];
        await user.save();

        return response.status(200).json({
            _id: userId,
            avatar: imagesArray[0],
        })
        
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false,
        });
    }
}

// ********** User Avatar Remove **********

export async function avatarUserRemoveController(request, response) {
    
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

// ********** Update User Details **********

export async function updateUserDetailsController(request, response) {
    try {
        const userId = request.userId;
        const {name, email, mobile, password} = request.body;

        const userExist = await UserModel.findById( {_id: userId} );
        if (!userExist) {
            return response.status(404).send('The user can not be updated!')
        }

        let verifyCode = "";

        if (email !== userExist.email) {
            verifyCode = crypto.randomInt(100000, 999999).toString();
        }

        let hashPassword = "";

        if (password) {
            const salt = await bcryptjs.genSalt(10);
            hashPassword = await bcryptjs.hash(password, salt);
        } else {
            hashPassword = userExist.password;
        }

        const updateUser = await UserModel.findByIdAndUpdate(
            userId,
            {
                name: name || userExist.name,
                email: email || userExist.email,
                verify_email: email !== userExist.email ? false : true,
                mobile: mobile || userExist.mobile,
                password: hashPassword,
                otp: verifyCode !== "" ? verifyCode : null,
                otpExpires: verifyCode !== "" ? Date.now() + 600000 : "",
            },
            {
                new: true,
            }
        )

        // ********** Send Email for varification **********

        // if (email !== userExist.email) {
        //     const verifyEmail = await sendEmailFunc(
        //         email, // to
        //         "Verify Email from SHINE IIT", // subject
        //         "", // text
        //         verifyEmailTemplate(user.name, verifyCode) // html
        //       );
        // }

        return response.status(200).json({
            message: "User updated successfully",
            error: false,
            success: true,
            data: updateUser,
        });


    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false,
        }); 
    }
}

// ********** Forgot Password **********

export async function forgotPasswordController(request, response) {
    try {
        
        const { email } = request.body;

        const user = await UserModel.findOne({ email: email });

        if (!user) {
            return response.status(404).json({
                message: "User not found",
                error: true,
                success: false,
            });
        } else {
            let verifyCode = crypto.randomInt(100000, 999999).toString();

            user.otp = verifyCode;
            user.otpExpires = Date.now() + 600000;
            
            await user.save();
            
            // ********** Send Email for varification **********

            const verifyEmail = await sendEmailFunc(
                email, // to
                "Forgot your password! Here's OTP from SHINE IIT", // subject
                "", // text
                verifyEmailTemplate(user.name, verifyCode) // html
              );

            if (!verifyEmail.success) {
                console.error("Email failed:", emailResult.error);
                return response.status(500).json({
                    message: "Failed to send OTP email",
                    error: true,
                });
            }
    
            return response.json({
                message: "OTP sent successfully",
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


// ********** Verify Forgot Password **********

export async function verifyForgotPasswordController(request, response) {

    try {

        const { email, otp } = request.body;

        const user = await UserModel.findOne({ email: email });
        if (!user) {
            return response.status(404).json({
                message: "User not found",
                error: true,
                success: false,
            });
        }
    
        if (!email || !otp) {
            return response.status(400).json({
                message: "All fields are required",
                error: true,
                success: false,
            });
        }
    
        if (otp !== user.otp) {
            return response.status(400).json({
                message: "Invalid OTP",
                error: true,
                success: false,
            });
        }
    
        const currentTime = Date.now();
        if (currentTime > user.otpExpires) {
            return response.status(400).json({
                message: "OTP has expired",
                error: true,
                success: false,
            });
        }
    
        user.otp = null;
        user.otpExpires = null;
        await user.save();
    
        return response.status(200).json({
            message: "OTP verified successfully",
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

// ********** Reset Password **********

export async function resetPasswordController(request, response) {
    try {
        const { email, newPassword, confirmPassword } = request.body;
        if (!email || !newPassword || !confirmPassword) {
            return response.status(400).json({
                message: "All fields are required",
                error: true,
                success: false,
            });
        }

        const user = await UserModel.findOne({ email: email });

        if (!user) {
            return response.status(404).json({
                message: "User not found",
                error: true,
                success: false,
            });
        }

        if (newPassword !== confirmPassword) {
            return response.status(400).json({
                message: "Passwords do not match",
                error: true,
                success: false,
            })
        }

        const salt = await bcryptjs.genSalt(10);
        const hashPassword = await bcryptjs.hash(newPassword, salt);

        user.password = hashPassword;
        user.otp = undefined;
        user.otpExpires = undefined;

        await user.save();

        return response.status(200).json({
            message: "Password Updated successfully",
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

// ********** Refresh Token **********

export async function refreshTokenController(request, response) {
    try {
        const refreshToken = request.cookies.refreshToken || request?.headers?.authorization?.split(" ")[1] ;
        
        if (!refreshToken) {
            return response.status(401).json({
                message: "Refresh token is required",
                error: true,
                success: false,
            });
        }

        const verifyToken = await jwt.verify(refreshToken, process.env.SECRET_KEY_REFRESH_TOKEN);

        if (!verifyToken) {
            return response.status(401).json({
                message: "Invalid refresh token",
                error: true,
                success: false,
            });
        }

        const userId = verifyToken?.id;
        const newAccessToken = await generateAccessToken(userId);

        const cookiesOption = {
            httpOnly: true,
            secure: true,
            sameSite: "None",
        }

        response.cookie("accessToken", newAccessToken, cookiesOption);

        return response.status(200).json({
            message: "Access token refreshed successfully",
            error: false,
            success: true,
            data: {
                accessToken: newAccessToken,
            }
        })

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false,
        }); 
    }
}

// ********** Get Login User Details **********

export async function getLoginUserDetailsController(request, response) {
    try {

        const userId = request.params.userId;

        const user = await UserModel.findById(userId)

        return response.status(200).json({
            message: "User details fetched successfully",
            error: false,
            success: true,
            data: user,
        });
        
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false,
        }); 
    }
}