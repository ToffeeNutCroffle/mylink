import { ImageResponse } from "next/og";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function Image({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;

  let displayName = username;
  let bio = "";

  const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000";

  const [fontData] = await Promise.all([
    fetch(`${baseUrl}/fonts/NotoSansKR.ttf`).then((r) => r.arrayBuffer()),
    (async () => {
      try {
        const q = query(collection(db, "users"), where("username", "==", username));
        const snap = await getDocs(q);
        if (!snap.empty) {
          const profile = snap.docs[0].data();
          displayName = (profile.displayName as string) || username;
          bio = (profile.bio as string) || "";
        }
      } catch {
        // DB 조회 실패 시 username으로 폴백
      }
    })(),
  ]);

  const fonts = [{ name: "Noto Sans KR", data: fontData, weight: 700 as const, style: "normal" as const }];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#5B5FC7",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "24px",
          padding: "64px",
        }}
      >
        {/* 아바타 */}
        <div
          style={{
            width: "120px",
            height: "120px",
            borderRadius: "60px",
            background: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "56px",
            fontWeight: "bold",
            color: "#5B5FC7",
          }}
        >
          {displayName.slice(0, 1).toUpperCase()}
        </div>

        {/* 이름 */}
        <div
          style={{
            fontSize: "64px",
            fontWeight: "bold",
            color: "white",
            textAlign: "center",
          }}
        >
          {displayName}
        </div>

        {/* 유저명 */}
        <div
          style={{
            fontSize: "32px",
            color: "rgba(255,255,255,0.75)",
            textAlign: "center",
          }}
        >
          @{username}
        </div>

        {/* 소개글 */}
        {bio && (
          <div
            style={{
              fontSize: "28px",
              color: "rgba(255,255,255,0.85)",
              textAlign: "center",
              maxWidth: "800px",
            }}
          >
            {bio}
          </div>
        )}

        {/* 서비스명 */}
        <div
          style={{
            position: "absolute",
            bottom: "40px",
            fontSize: "24px",
            color: "rgba(255,255,255,0.6)",
          }}
        >
          마이링크
        </div>
      </div>
    ),
    { ...size, fonts }
  );
}
