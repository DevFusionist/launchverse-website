// This file is no longer needed as we'll use serverless functions instead
export async function generateBlogPost() {
  try {
    const response = await fetch("/api/cron/generate-blog", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.CRON_SECRET_KEY}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to generate blog post");
    }

    return await response.json();
  } catch (error) {
    console.error("Error generating blog post:", error);
    throw error;
  }
}
