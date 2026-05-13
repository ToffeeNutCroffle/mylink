import type { MetadataRoute } from "next";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const BASE_URL = "https://mylink.vercel.app";

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date() },
    { url: `${BASE_URL}/login`, lastModified: new Date() },
  ];

  try {
    const usersSnap = await getDocs(collection(db, "users"));
    const userRoutes: MetadataRoute.Sitemap = usersSnap.docs
      .filter((d) => d.data().username)
      .map((d) => ({
        url: `${BASE_URL}/${d.data().username as string}`,
        lastModified: new Date(),
      }));

    return [...staticRoutes, ...userRoutes];
  } catch {
    return staticRoutes;
  }
}
