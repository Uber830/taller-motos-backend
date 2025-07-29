import { PrismaClient } from "@prisma/client";
import { InternalServerError } from "../../../core/errors";
import { UpdateUserDto } from "../types/user.types";

const prisma = new PrismaClient();

export class UserService {
    async updateUser(userId: string, data: UpdateUserDto) {
        try {
            const updatedUser = await prisma.user.update({
                where: { id: userId },
                data,
            });
            return updatedUser;
        } catch (error) {
            throw new InternalServerError("Failed to update user");
        }
    }
}

export const userService = new UserService(); 