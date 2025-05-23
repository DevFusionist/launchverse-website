import "dotenv/config";
import connectDB from "@/lib/db/mongodb";
import Admin from "@/models/Admin";

async function main() {
  try {
    await connectDB();

    const superAdminData = {
      name: "Arindam",
      email: "sacredwebdev@gmail.com",
      password: "Arindam@1995",
      role: "super_admin" as const,
    };

    // Check if super admin already exists
    const existingAdmin = await Admin.findOne({ email: superAdminData.email });
    if (existingAdmin) {
      console.log("Super admin with this email already exists.");
      process.exit(0);
    }

    // Create new super admin
    const admin = new Admin(superAdminData);
    await admin.save();

    console.log("Super admin created successfully:", {
      name: superAdminData.name,
      email: superAdminData.email,
      role: superAdminData.role,
    });

    process.exit(0);
  } catch (error) {
    console.error("Error creating super admin:", error);
    process.exit(1);
  }
}

main();
