import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    // Check for authorization (you should implement proper authentication)
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET_KEY}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Make a request to the generate-blog endpoint instead
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SITE_URL}/api/cron/generate-blog`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.CRON_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to generate blog post");
    }

    return NextResponse.json({ message: "Blog post generation started" });
  } catch (error) {
    console.error("Error triggering blog post generation:", error);
    return NextResponse.json(
      { error: "Failed to trigger blog post generation" },
      { status: 500 }
    );
  }
}
