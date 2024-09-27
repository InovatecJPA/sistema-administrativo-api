import { UserService } from "../service/UserService";
import { Repository } from "typeorm";
import User from "../model/User";
import { ProfileService } from "../service/ProfileService";
import { NotFoundError } from "../../../error/NotFoundError";
import { AlreadyExistsError } from "../../../error/AlreadyExistsError";
import AppDataSource from "../../../database/dbConnection";

// Mocks
const mockUserRepository = {
  find: jest.fn(),
  findOne: jest.fn(),
  findOneBy: jest.fn(),
  save: jest.fn(),
  findAndCount: jest.fn(),
  create: jest.fn(),
};

const mockProfileService = {
  findOne: jest.fn(),
  createProfile: jest.fn(),
};

describe("UserService", () => {
  let userService: UserService;

  beforeAll(async () => {
    // Inicializa a conexão com o banco de dados antes dos testes
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }
  });

  afterAll(async () => {
    // Fecha a conexão com o banco de dados após os testes
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
  });

  beforeEach(() => {
    // Inicializa o serviço com os mocks
    userService = new UserService(
      mockUserRepository as unknown as Repository<User>,
      mockProfileService as unknown as ProfileService
    );
  });

  afterEach(() => {
    jest.clearAllMocks(); // Limpa os mocks após cada teste
  });

  describe("findAll", () => {
    it("should return a list of users", async () => {
      const users = [{ id: "1", name: "Test User" }];
      mockUserRepository.find.mockResolvedValue(users);

      const result = await userService.findAll();

      expect(mockUserRepository.find).toHaveBeenCalledTimes(1);
      expect(result).toEqual(users);
    });
  });

  describe("findOne", () => {
    it("should return a user when found", async () => {
      const user = { id: "1", name: "Test User", profile: {} };
      mockUserRepository.findOne.mockResolvedValue(user);

      const result = await userService.findOne({ id: "1" });

      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { id: "1" },
        relations: ["profile"],
      });
      expect(result).toEqual(user);
    });

    it("should return null when user is not found", async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      const result = await userService.findOne({ id: "2" });

      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { id: "2" },
        relations: ["profile"],
      });
      expect(result).toBeNull();
    });
  });

  describe("createUser", () => {
    it("should throw an error if user already exists", async () => {
      mockUserRepository.findOne.mockResolvedValueOnce({ id: "1" });

      const newUser = {
        email: "test@example.com",
        cpf: "12345678900",
        phone: "123456789",
        name: "New User",
        profileName: "admin",
        password: "password",
      };

      await expect(userService.createUser(newUser)).rejects.toThrow(
        AlreadyExistsError
      );
    });

    it("should create and return a new user", async () => {
      const profile = { id: "profile-id", name: "admin" };
      mockUserRepository.findOne.mockResolvedValueOnce(null); // No existing user
      mockProfileService.findOne.mockResolvedValue(profile); // Profile exists
      mockUserRepository.create.mockReturnValue({
        id: "new-user-id",
        name: "New User",
      });
      mockUserRepository.save.mockResolvedValue({
        id: "new-user-id",
        name: "New User",
      });

      const newUser = {
        email: "test@example.com",
        cpf: "12345678900",
        phone: "123456789",
        name: "New User",
        profileName: "admin",
        password: "password",
      };

      const result = await userService.createUser(newUser);

      expect(mockUserRepository.findOne).toHaveBeenCalledTimes(1);
      expect(mockProfileService.findOne).toHaveBeenCalledWith({
        name: "admin",
      });
      expect(mockUserRepository.create).toHaveBeenCalledWith({
        cpf: newUser.cpf,
        name: newUser.name,
        email: newUser.email,
        profile: profile,
        phone: newUser.phone,
        isActive: true,
      });
      expect(mockUserRepository.save).toHaveBeenCalledTimes(1);
      expect(result).toEqual({
        id: "new-user-id",
        name: "New User",
      });
    });
  });

  describe("updateUser", () => {
    it("should update an existing user", async () => {
      const user = { id: "1", name: "Old Name", hashPassword: jest.fn() };
      mockUserRepository.findOneBy.mockResolvedValue(user);
      mockUserRepository.save.mockResolvedValue({ ...user, name: "New Name" });

      const updatedUser = await userService.updateUser("1", {
        name: "New Name",
      });

      expect(mockUserRepository.findOneBy).toHaveBeenCalledWith({ id: "1" });
      expect(user.name).toBe("New Name");
      expect(mockUserRepository.save).toHaveBeenCalledWith(user);
      expect(updatedUser).toEqual({ ...user, name: "New Name" });
    });

    it("should throw an error if user is not found", async () => {
      mockUserRepository.findOneBy.mockResolvedValue(null);

      await expect(
        userService.updateUser("1", { name: "New Name" })
      ).rejects.toThrow(NotFoundError);
    });
  });
});
