import { z } from "zod";
//  import { Role } from '../auth/types';

// export type { Role } from '../auth/types';

export const userRoleSchema = z.enum(["MECHANIC", "OWNER", "ADMIN"]);

export const assignRoleSchema = z.object({
  userId: z.string(),
  role: userRoleSchema,
});

export const deleteUserSchema = z.object({
  userId: z.string(),
});

export type AssignRoleParams = z.infer<typeof assignRoleSchema>;
export type DeleteUserParams = z.infer<typeof deleteUserSchema>;
