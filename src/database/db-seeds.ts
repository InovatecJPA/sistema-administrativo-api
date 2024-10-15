import AppDataSource from "../database/dbConnection"; // Ajuste o caminho conforme necessário
import { readdirSync } from "fs";
import { join, resolve } from "path";

async function runSeeds() {
  try {
    await AppDataSource.initialize();
    console.log("📦 Database connected successfully.");

    const seedsPath = resolve(__dirname, "../apps"); // Caminho ajustado para 'apps/'
    const seedFiles = findSeedFiles(seedsPath);

    if (seedFiles.length === 0) {
      console.log("⚠️ No seed files found.");
      await AppDataSource.destroy();
      process.exit(0);
    }

    console.log("📋 Available Seeds:");
    seedFiles.forEach((seed, index) => {
      console.log(`  ${index + 1}. ${seed}`);
    });

    console.log("\n🚀 Starting seeds...\n");

    for (const seed of seedFiles) {
      try {
        console.log(`🌱 Running seed: ${seed}`);
        const seedModule = await import(seed);
        console.log(`📦 Imported seed module:`, seedModule);

        const runFunction =
          (seedModule.default && seedModule.default.run) ||
          seedModule.run ||
          seedModule.default;

        if (typeof runFunction === "function") {
          await runFunction();
          console.log(`✅ Seed ${seed} ran successfully.`);
        } else {
          console.warn(`⚠️ Seed ${seed} does not export a valid run function.`);
        }
      } catch (error) {
        console.error(`❌ Error running seed ${seed}:`, error);
      }
    }

    console.log("✅ Seeding completed.");
    await AppDataSource.destroy();
  } catch (error) {
    console.error("❌ Error running seeds:", error);
    process.exit(1);
  }
}

function findSeedFiles(dir: string): string[] {
  const files = readdirSync(dir, { withFileTypes: true });
  let seedFiles: string[] = [];

  for (const file of files) {
    const fullPath = join(dir, file.name);
    if (file.isDirectory()) {
      seedFiles = seedFiles.concat(findSeedFiles(fullPath));
    } else if (
      file.name.match(/index\.(ts|js)$/) &&
      fullPath.includes("/seeds/")
    ) {
      seedFiles.push(fullPath);
    }
  }

  return seedFiles;
}

runSeeds();
