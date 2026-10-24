import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Scenopia",
    short_name: "Scenopia",
    description:
      "Le second cerveau du tournage : conducteur, plans, salle et planning.",
    start_url: "/",
    display: "standalone",
    background_color: "#f2f3ef",
    theme_color: "#141719",
    lang: "fr",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
