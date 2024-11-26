import express from "express";
import { deleteUserController, getUserController, getUsersController, postUserController, updateUserController } from "../controller/userController";

const userRouter = express.Router();

userRouter.get("/", getUsersController);

userRouter.post("/", postUserController);

userRouter.get("/:id", getUserController);

userRouter.put("/:id", updateUserController);

userRouter.delete("/:id", deleteUserController)

export default userRouter;