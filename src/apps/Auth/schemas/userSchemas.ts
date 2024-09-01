import { z } from "zod";
import CpfValidator from "../utils/CpfValidator";

export const userResistrationSchema = z.object({
  cpf: z.string().refine(CpfValidator.validate, {
    message: "invalid",
  }),
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(6),
  phone: z.string(),
  profileName: z.string().optional(),
  isActive: z.boolean().optional(),
});

export const userLoginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const forgortPasswordSchema = z.object({
  email: z.string().email(),
});

export const resetPasswordSchema = z.object({
  password: z.string().min(6),
});

export const changePasswordSchema = z.object({
  newPassword: z.string().min(6),
  newPasswordConfirm: z.string().min(6),
  oldPassword: z.string().min(6),
});