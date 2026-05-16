import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function fetchProfile(username: string) {
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;

  const res = await fetch(
    `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents:runQuery?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        structuredQuery: {
          from: [{ collectionId: "users" }],
          where: {
            fieldFilter: {
              field: { fieldPath: "username" },
              op: "EQUAL",
              value: { stringValue: username },
            },
          },
          limit: 1,
        },
      }),
    }
  );

  const data = await res.json();
  const doc = data[0]?.document;
  if (!doc) return null;

  return {
    displayName: doc.fields?.displayName?.stringValue || username,
    bio: doc.fields?.bio?.stringValue || "",
    photoURL: doc.fields?.photoURL?.stringValue || "",
  };
}

export default async function Image({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;

  const profile = await fetchProfile(username).catch(() => null);

  const displayName = profile?.displayName || username;
  const bio = profile?.bio || "";
  let photoSrc = "";

  if (profile?.photoURL) {
    const buffer = await fetch(profile.photoURL).then((r) => r.arrayBuffer()).catch(() => null);
    if (buffer) {
      photoSrc = `data:image/jpeg;base64,${Buffer.from(buffer).toString("base64")}`;
    }
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
        {photoSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={photoSrc}
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
