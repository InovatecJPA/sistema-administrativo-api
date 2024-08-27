export interface CreateUserDTO {
  cpf: string;
  name: string;
  email: string;
  profileName: string | null;
  password: string;
  phone: string;
  isAtivo?: boolean;
}
