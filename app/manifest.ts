import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "hola me gustas",
    short_name: "hola me gustas",
    description: "Un plan de cita especial para el sábado ✨",
    start_url: "/",
    display: "standalone",
    background_color: "#111111",
    theme_color: "#111111",
    orientation: "portrait",
    categories: ["lifestyle", "entertainment"],
    icons: [
      {
        src: "/icons/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icons/icon-256x256.png",
        sizes: "256x256",
        type: "image/png",
      },
      {
        src: "/icons/icon-384x384.png",
        sizes: "384x384",
        type: "image/png",
      },
      {
        src: "/icons/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
