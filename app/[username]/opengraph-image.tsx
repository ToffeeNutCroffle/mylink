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

  const q = query(collection(db, "users"), where("username", "==", username));
  const snap = await getDocs(q);

  let displayName = username;
  let bio = "";
  let photoURL = "";

  if (!snap.empty) {
    const profile = snap.docs[0].data();
    displayName = (profile.displayName as string) || username;
    bio = (profile.bio as string) || "";
    photoURL = (profile.photoURL as string) || "";
  }

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
          gap: "20px",
          padding: "64px",
        }}
      >
        {photoURL ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={photoURL}
            width={120}
            height={120}
            style={{ borderRadius: "60px", objectFit: "cover" }}
            alt={displayName}
          />
        ) : (
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
        )}
        <div style={{ fontSize: "56px", fontWeight: "bold", color: "white" }}>
          {displayName}
        </div>
        <div style={{ fontSize: "32px", color: "rgba(255,255,255,0.7)" }}>
          @{username}
        </div>
        {bio ? (
          <div
            style={{
              fontSize: "28px",
              color: "rgba(255,255,255,0.85)",
              textAlign: "center",
              maxWidth: "900px",
            }}
          >
            {bio}
          </div>
        ) : null}
        <div style={{ fontSize: "24px", color: "rgba(255,255,255,0.5)", marginTop: "8px" }}>
          mylink
        </div>
      </div>
    ),
    { ...size }
  );
}
