import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function Image() {
  const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000";

  const fontData = await fetch(`${baseUrl}/fonts/NotoSansKR.ttf`).then((r) =>
    r.arrayBuffer()
  );

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
        }}
      >
        <div
          style={{
            background: "#FEF08A",
            border: "4px solid black",
            borderRadius: "20px",
            padding: "16px 40px",
          }}
        >
          <span
            style={{
              fontSize: "80px",
              fontWeight: "bold",
              color: "black",
              fontFamily: "Noto Sans KR",
            }}
          >
            마이링크
          </span>
        </div>
        <span
          style={{
            fontSize: "36px",
            color: "rgba(255,255,255,0.85)",
            fontFamily: "Noto Sans KR",
          }}
        >
          모든 링크를 한 곳에 모아 공유하세요
        </span>
      </div>
    ),
    {
      ...size,
      fonts: [{ name: "Noto Sans KR", data: fontData, weight: 700, style: "normal" }],
    }
  );
}
