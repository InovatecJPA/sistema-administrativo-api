import AppDataSource from "../../../database/dbConnection";
import User from "../model/User";
import Profile from "../model/Profile";
import { authService } from "../service/AuthService";
import { userService } from "../service/UserService";

async function run() {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    const profileRepository = AppDataSource.getRepository(Profile);
    const userRepository = AppDataSource.getRepository(User);

    let profile: Profile = await profileRepository.findOneBy({
      name: "coordenador_projetos",
    });
    if (!profile) {
      profile = profileRepository.create({
        name: "coordenador_projetos",
        description: "Coordenador de Projetos",
      });
      await profileRepository.save(profile);
    }

    console.log("profile: ", profile.id);
    
    const userExists: User = await userRepository.findOneBy({
      email: "psico@gmail.com",
    });

    if (userExists) {
      console.log("Psico já está cadastrado no sistema.");
      return;
    }

    await userService.createUser({
      password: "test123",
      cpf: "48174880003",
      name: "Coordenador Psico",
      birthDate: new Date("1822-09-07T00:00:00-03:00"),
      isActive: true,
      email: "psico@gmail.com",
      phone: "(83)99907-7888",
      profileName: profile.name,
    });

    console.log("✅ User Psico created successfully.");
    console.log("ℹ️ Coordenador user credentials:");
    console.log("   📧 Email: psico@gmail.com");
    console.log("   🔑 Password: test123");

    await AppDataSource.destroy();
  } catch (error) {
    console.error("Error in create user:", error);
    await AppDataSource.destroy();
  }
}

run();
