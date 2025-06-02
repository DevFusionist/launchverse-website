import { NextResponse } from "next/server";

import { withAuth, AuthenticatedRequest } from "@/lib/auth";

async function meHandler(req: AuthenticatedRequest) {
  return NextResponse.json({
    user: req.user,
  });
}

export const GET = withAuth(meHandler);
