import { NextResponse } from "next/server";
import { z } from "zod";
import connectDB from "@/lib/db/mongodb";
import Admin from "@/models/Admin";
import { rateLimit } from "@/lib/rate-limit";
import bcrypt from "bcryptjs";
import { getAdminSession, requireSuperAdmin } from "@/lib/admin-session";

// Mark route as dynamic
export const dynamic = "force-dynamic";

const querySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  search: z.string().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
  role: z.enum(["admin", "super_admin"]).optional(),
});

const createAdminSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.literal("admin"),
});

interface AdminCreateData {
  name: string;
  email: string;
  password: string;
  role?: string;
}

interface QueryFilter {
  $or?: Array<{ [key: string]: { $regex: string; $options: string } }>;
  role?: string;
}

interface SortConfig {
  [key: string]: 1 | -1;
}

export async function GET(request: Request) {
  try {
    // Rate limiting
    const limiter = rateLimit({
      interval: 60 * 1000,
      uniqueTokenPerInterval: 500,
    });
    await limiter.check(10, "ADMINS_FETCH");

    // Get and validate session
    const { session, error } = await getAdminSession(request);
    if (error) return error;

    // Check for super admin role
    const superAdminError = requireSuperAdmin(session);
    if (superAdminError) return superAdminError;

    // Parse and validate query params
    const { searchParams } = new URL(request.url);
    const query = Object.fromEntries(searchParams.entries());
    const validatedQuery = querySchema.parse(query);

    // Connect to DB
    await connectDB();

    // Build query
    const filter: QueryFilter = {};
    if (validatedQuery.search) {
      filter.$or = [
        { name: { $regex: validatedQuery.search, $options: "i" } },
        { email: { $regex: validatedQuery.search, $options: "i" } },
      ];
    }
    if (validatedQuery.role) {
      filter.role = validatedQuery.role;
    }

    // Build sort
    const sort: SortConfig = {};
    if (validatedQuery.sortBy) {
      sort[validatedQuery.sortBy] =
        validatedQuery.sortOrder === "desc" ? -1 : 1;
    } else {
      sort.createdAt = -1;
    }

    // Pagination
    const page = parseInt(validatedQuery.page || "1");
    const limit = parseInt(validatedQuery.limit || "10");
    const skip = (page - 1) * limit;

    // Fetch data
    const [admins, total] = await Promise.all([
      Admin.aggregate([
        { $match: filter },
        {
          $lookup: {
            from: "certificates",
            localField: "_id",
            foreignField: "adminId",
            as: "certificates",
          },
        },
        {
          $addFields: {
            _count: {
              certificates: { $size: "$certificates" },
            },
          },
        },
        { $unset: "certificates" },
        { $sort: sort },
        { $skip: skip },
        { $limit: limit },
      ]),
      Admin.countDocuments(filter),
    ]);

    // Convert ObjectIds to strings for JSON serialization
    const serializedAdmins = admins.map((admin) => ({
      ...admin,
      _id: admin._id.toString(),
      createdAt: admin.createdAt.toISOString(),
    }));

    return NextResponse.json({
      data: serializedAdmins,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching admins:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid query parameters", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    // Rate limiting
    const limiter = rateLimit({
      interval: 60 * 1000,
      uniqueTokenPerInterval: 500,
    });
    await limiter.check(5, "ADMIN_CREATE");

    // Get and validate session
    const { session, error } = await getAdminSession(request);
    if (error) return error;

    // Check for super admin role
    const superAdminError = requireSuperAdmin(session);
    if (superAdminError) return superAdminError;

    // Parse and validate request body
    const data = (await request.json()) as AdminCreateData;
    const validatedData = createAdminSchema.parse(data);

    // Connect to DB
    await connectDB();

    // Check if admin with email already exists
    const existingAdmin = await Admin.findOne({ email: validatedData.email });
    if (existingAdmin) {
      return NextResponse.json(
        { error: "An admin with this email already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(validatedData.password, 12);

    // Create new admin (always as regular admin)
    const admin = await Admin.create({
      ...validatedData,
      role: "admin",
      password: hashedPassword,
    });

    // Remove password from response
    const adminWithoutPassword = admin.toObject();
    delete adminWithoutPassword.password;

    return NextResponse.json({
      data: {
        ...adminWithoutPassword,
        _id: adminWithoutPassword._id.toString(),
        createdAt: adminWithoutPassword.createdAt.toISOString(),
      },
    });
  } catch (error) {
    console.error("Error creating admin:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input data", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
