import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export interface AdminSession {
  user: {
    name: string;
    email: string;
    image?: string;
    role: "admin" | "super_admin";
    id: string;
  };
}

export async function getAdminSession(request: Request): Promise<{
  session: AdminSession | null;
  error?: NextResponse;
}> {
  // Get session from headers first (for server-side calls)
  const headersList = request.headers;
  const sessionUserId = headersList.get("x-session-user-id");
  const sessionUserRole = headersList.get("x-session-user-role") as
    | "admin"
    | "super_admin"
    | null;

  let session: AdminSession | null = null;

  if (sessionUserId && sessionUserRole) {
    // Use session from headers if available (server-side call)
    session = {
      user: {
        id: sessionUserId,
        role: sessionUserRole,
        name: headersList.get("x-session-user-name") || "",
        email: headersList.get("x-session-user-email") || "",
      },
    };
  } else {
    // Fallback to getServerSession for client-side calls
    const serverSession = await getServerSession(authOptions);
    if (serverSession?.user) {
      session = {
        user: {
          id: serverSession.user.id as string,
          role: serverSession.user.role as "admin" | "super_admin",
          name: serverSession.user.name as string,
          email: serverSession.user.email as string,
          image: serverSession.user.image as string | undefined,
        },
      };
    }
  }

  if (!session) {
    return {
      session: null,
      error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  return { session };
}

export function requireSuperAdmin(
  session: AdminSession | null
): NextResponse | null {
  if (!session || session.user.role !== "super_admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}

export function requireAdmin(
  session: AdminSession | null
): NextResponse | null {
  if (!session || !["admin", "super_admin"].includes(session.user.role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}
