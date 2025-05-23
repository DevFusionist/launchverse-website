import { NextRequest, NextResponse } from "next/server.js";
import connectDB from "@/lib/db/mongodb";
import Certificate from "@/models/Certificate";

export async function GET(
  request: NextRequest,
  { params }: { params: { certificateId: string } }
) {
  try {
    await connectDB();
    const certificate = await Certificate.findOne({
      certificateId: params.certificateId,
    });

    if (!certificate) {
      return new NextResponse(null, { status: 404 });
    }

    return NextResponse.json(certificate);
  } catch (error) {
    console.error("Error verifying certificate:", error);
    return new NextResponse(null, { status: 500 });
  }
}
