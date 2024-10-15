import { runSeeder } from "typeorm-seeding";
// import CreateAdminSeed from "./create-admin.seed";

export async function run() {
  try {
    // await runSeeder(CreateAdminSeed);
  } catch (err) {
    console.log("❌ Error running seeds", err);
  }
}
