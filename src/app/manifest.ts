import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://scriptauradev.com";

  return {
    name: "Launch Verse Academy - Computer Training Institute in Chandannagar",
    short_name: "Launch Verse Academy",
    description:
      "Professional computer training institute offering courses in Web Development, Graphic Design, Web Design, and MS Office. Get certified and launch your career today.",
    start_url: `${baseUrl}/`,
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#ffffff",
    icons: [
      {
        src: "/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    shortcuts: [
      {
        name: "Home",
        url: "/",
        description: "Launch Verse Academy Homepage",
      },
      {
        name: "Courses",
        url: "/courses",
        description: "View all courses offered by Launch Verse Academy",
      },
      {
        name: "Contact",
        url: "/contact",
        description: "Contact Launch Verse Academy",
      },
    ],
    categories: ["education", "training"],
    screenshots: [
      {
        src: "/screenshot-1.png",
        sizes: "1280x720",
        type: "image/png",
      },
    ],
    related_applications: [],
    prefer_related_applications: false,
    scope: "/",
    lang: "en-US",
    dir: "ltr",
    orientation: "any",
    share_target: {
      action: "/share-target",
      method: "post",
      enctype: "multipart/form-data",
      params: [
        {
          name: "title",
          value: "title",
        },
        {
          name: "text",
          value: "text",
        },
        {
          name: "url",
          value: "url",
        },
      ],
    },
  };
}
