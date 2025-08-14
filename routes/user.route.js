import { Router } from "express";
import { avatarUserController, avatarUserRemoveController, forgotPasswordController, getLoginUserDetailsController, loginUserController, logoutUserController, refreshTokenController, registerUserController, resetPasswordController, updateUserDetailsController, verifyEmailController, verifyForgotPasswordController } from "../controllers/user.controller.js";
import auth from "../middlewares/auth.js";
import upload from "../middlewares/multer.js";

const userRouter = Router();
userRouter.post("/register", registerUserController);
userRouter.post("/verify-email", verifyEmailController);
userRouter.post("/login", loginUserController);
userRouter.get("/logout", auth, logoutUserController);
userRouter.put("/user-avatar", auth, upload.array('avatar'), avatarUserController)
userRouter.delete("/delete-avatar", auth, avatarUserRemoveController)
userRouter.put("/:id", auth, updateUserDetailsController)
userRouter.post("/forgot-password", forgotPasswordController)
userRouter.post("/verify-forgot-password", verifyForgotPasswordController)
userRouter.post("/reset-password", resetPasswordController)
userRouter.post("/refresh-token", refreshTokenController)
userRouter.get("/user-details/:userId", auth, getLoginUserDetailsController)

export default userRouter;