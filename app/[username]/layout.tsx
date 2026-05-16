import type { Metadata } from "next";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>;
}): Promise<Metadata> {
  const { username } = await params;

  const q = query(collection(db, "users"), where("username", "==", username));
  const snap = await getDocs(q);

  if (snap.empty) {
    return { title: "존재하지 않는 페이지 | 마이링크" };
  }

  const profile = snap.docs[0].data();
  const displayName = profile.displayName as string;
  const bio = (profile.bio as string) || `${displayName}의 링크 모음`;

  return {
    title: `${displayName} (@${username}) | 마이링크`,
    description: bio,
    openGraph: {
      title: `${displayName} (@${username})`,
      description: bio,
      url: `https://mylink.vercel.app/${username}`,
      type: "profile",
      images: [{ url: `https://mylink.vercel.app/${username}/opengraph-image`, width: 1200, height: 630 }],
    },
  };
}

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
