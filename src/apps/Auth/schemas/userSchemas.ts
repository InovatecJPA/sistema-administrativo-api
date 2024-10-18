import { z } from "zod";
import CpfValidator from "../utils/CpfValidator";

export const userResistrationSchema = z.object({
  cpf: z
    .string()
    .transform((cpf) => cpf.replace(/\D/g, "")) // Remove caracteres não numéricos
    .refine((cpf) => cpf.length === 11, {
      message: "CPF deve conter 11 dígitos.",
    })
    .refine(CpfValidator.validate, {
      message: "CPF inválido.",
    }),
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(6),
  phone: z.string(),
  birthDate: z.date().optional(),
  profileName: z.string().optional(),
  isActive: z.boolean().optional(),
});

export type createUserDTO = z.infer<typeof userResistrationSchema>;

export const ShowUserDTO = z.object({
  id: z.string().uuid(),
  cpf: z.string(),
  name: z.string(),
  email: z.string().email(),
  phone: z.string().nullable(),
  isActive: z.boolean(),
  profile: z.object({
    id: z.string().uuid(),
    name: z.string(),
    description: z.string(),
  }),
  sector: z
    .object({
      id: z.string().uuid(),
      name: z.string(),
      description: z.string(),
    })
    .nullable(),
});

export type ShowUserDTO = z.infer<typeof ShowUserDTO>;

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
  cpf: z
    .string()
    .min(11)
    .transform((cpf) => cpf.replace(/\D/g, ""))
    .optional(), // CPF com 11 caracteres
  email: z.string().email().optional(), // Email deve ser válido
  birthDate: z.date().optional(), // Data de nascimento é opcional
  phone: z.string().optional(), // Número de telefone opcional
  isActive: z.boolean().optional(), // Status da conta
  sector: z
    .object({
      id: z.string().uuid(),
    })
    .optional(), // Setor do usuário
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

//offtopic
export interface Pagination {
  path: string;
  page: number;
  prev_page_url: number | false;
  next_page_url: number | false;
  total: number;
}

export interface UserPaginatedResponse {
  listUser: ShowUserDTO[];
  pagination: Pagination;
}
