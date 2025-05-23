import "dotenv/config";
import readline from "readline";
import connectDB from "@/lib/db/mongodb";
import Admin from "@/models/Admin";

async function prompt(question: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve) =>
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer);
    })
  );
}

async function main() {
  await connectDB();
  const name = await prompt("Admin name: ");
  const email = await prompt("Admin email: ");
  const password = await prompt("Admin password: ");

  const existing = await Admin.findOne({ email });
  if (existing) {
    console.log("Admin with this email already exists.");
    process.exit(1);
  }

  const admin = new Admin({ name, email, password, role: "admin" });
  await admin.save();
  console.log("Admin created successfully:", { name, email });
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
