import { seedCourses } from "../src/lib/seeders/courseSeeder.js";

async function main() {
  try {
    console.log("Starting course seeding...");
    await seedCourses();
    console.log("Course seeding completed successfully!");
  } catch (error) {
    console.error("Failed to seed courses:", error);
    process.exit(1);
  }
}

main();
