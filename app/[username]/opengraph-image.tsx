import { ImageResponse } from "next/og";

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
          {username.slice(0, 1).toUpperCase()}
        </div>
        <div style={{ fontSize: "64px", fontWeight: "bold", color: "white" }}>
          @{username}
        </div>
        <div style={{ fontSize: "28px", color: "rgba(255,255,255,0.7)" }}>
          mylink
        </div>
      </div>
    ),
    { ...size }
  );
}
