import { Response, Request, NextFunction } from "express";
import { PrismaClient, Prisma } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

const userSchema = z.object({
    name: z.string(),
    email: z.string().email()
})

export const getUsersController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await prisma.user.findMany()
        res.json(users)
    } catch (error) {
        console.log(error);
    }
}

export const postUserController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const validatedData = userSchema.parse(req.body);
        const user = await prisma.user.create({
            data: validatedData,
        });
        res.status(200).json({
            message: "User is Created",
            user
        })
    } catch (e) {
        if (e instanceof z.ZodError) {
            res.status(400).json({
                message: e.issues[0].message,
            });
        } else if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
            res.status(400).json({
                message: "Email is already in use. Please use a different email.",
            });
        } else {
            console.error(e);
            res.status(500).json({
                message: "Internal server error",
            });
        }
    }
}

export const getUserController = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    try {
        const userId = Number(id);
        if (isNaN(userId)) {
            res.status(400).json({ message: "Invalid user ID format." });
            return
        }
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            res.status(404).json({ message: "User not found." });
            return
        }
        res.status(200).json(user);
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};

export const updateUserController = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    try {
        const userId = Number(id);
        if (isNaN(userId)) {
            res.status(400).json({ message: "Invalid user ID format." });
            return
        }
        const validatedData = userSchema.parse(req.body);
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: validatedData,
        });
        res.status(200).json({
            message: "User updated successfully.",
            user: updatedUser,
        });
    } catch (error: any) {
        if (error instanceof z.ZodError) {
            res.status(400).json({ errors: error.issues });
        } else if (error.code === "P2025") {
            res.status(404).json({ message: "User not found." });
        }
        console.error("Error updating user:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};

export const deleteUserController = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    try {
        const userId = Number(id);
        if (isNaN(userId)) {
            res.status(400).json({ message: "Invalid user ID format." });
            return
        }
        const user = await prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            res.status(404).json({ message: "User not found." });
            return
        }
        await prisma.user.delete({
            where: { id: userId },
        });
        res.status(200).json({ message: "User deleted successfully." });
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};
