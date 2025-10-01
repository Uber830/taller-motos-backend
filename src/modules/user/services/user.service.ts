import { PrismaClient, User } from "@prisma/client";
import { InternalServerError } from "../../../core/errors";
import { UpdateUserDto } from "../types/user.types";

const prisma = new PrismaClient();

/**
 * Updates a user by ID
 * @param {string} userId - The user ID
 * @param {UpdateUserDto} data - The user data to update
 * @returns {Promise<User>} The updated user
 * @throws {InternalServerError} If the update fails
 */
export const updateUser = async (
  userId: string,
  data: UpdateUserDto,
): Promise<User> => {
  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data,
    });
    return updatedUser;
  } catch (error) {
    throw new InternalServerError("Failed to update user");
  }
};

/**
 * Gets a user by ID
 * @param {string} userId - The user ID
 * @returns {Promise<User | null>} The user or null if not found
 * @throws {InternalServerError} If the query fails
 */
export const getUserById = async (userId: string): Promise<User | null> => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    return user;
  } catch (error) {
    throw new InternalServerError("Failed to get user");
  }
};
