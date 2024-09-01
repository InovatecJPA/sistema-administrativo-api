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

export type createUserDTO = z.infer<typeof userResistrationSchema>;

export const userLoginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export type userLoginDTO = z.infer<typeof userLoginSchema>;

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

export type changePasswordDTO = z.infer<typeof changePasswordSchema>;

export const updateUserSchema = z.object({
  // Campos que podem ser atualizados
  name: z.string().min(1).optional(), // Opcional e deve ter pelo menos 1 caractere se fornecido
  cpf: z.string().length(11).optional(), // CPF com 11 caracteres
  email: z.string().email().optional(), // Email deve ser válido
  birthDate: z.date().optional(), // Data de nascimento é opcional
  phone: z.string().optional(), // Número de telefone opcional
  isActive: z.boolean().optional(), // Status da conta
  profile: z
    .object({
      id: z.string().uuid(), // Referência ao perfil, espera um UUID
    })
    .optional(),
});

export const updateUserProfileSchema = z.object({
  profile: z.object({
    id: z.string().uuid(),
  }),
});

export type UpdateUserDTO = z.infer<typeof updateUserSchema>;
