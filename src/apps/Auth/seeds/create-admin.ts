import AppDataSource from "../../../database/dbConnection";
import User from "../model/User";
import Profile from "../model/Profile";
import { utc } from "moment";

async function run() {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    const profileRepository = AppDataSource.getRepository(Profile);
    const userRepository = AppDataSource.getRepository(User);

    let adminProfile = await profileRepository.findOneBy({ name: "admin" });

    if (!adminProfile) {
      adminProfile = profileRepository.create({
        name: "admin",
        description: "Administrador do sistema",
      });
      await profileRepository.save(adminProfile);
    }

    const existingAdmin = await userRepository.findOneBy({
      email: "adminDaSilva@admin.com",
    });

    if (!existingAdmin) {
      const adminUser = userRepository.create({
        name: "Admin",
        email: "adminDaSilva@admin.com",
        cpf: "123456789",
        birthDate: new Date("1822-09-07T00:00:00-03:00"),
        isActive: true,
        profile: adminProfile,
      });
      adminUser.password = "senhaSegura556";
      // adminUser.hashPassword();
      await userRepository.save(adminUser);

      console.log("✅ Admin user created successfully.");
      console.log("ℹ️ Admin user credentials:");
      console.log("   📧 Email: adminDaSilva@admin.com");
      console.log("   🔑 Password: senhaSegura556");
    } else {
      console.log("Admin user already exists.");
    }

    await AppDataSource.destroy();
  } catch (error) {
    console.error("Error in create user:", error);
    await AppDataSource.destroy();
  }
}

run();
