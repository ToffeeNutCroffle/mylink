import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function Image() {
  const fontData = await fetch(
    "https://fonts.gstatic.com/s/notosanskr/v36/PbykFmXiEBPT4ITbgNA5Cgm20xz64px_1hVWr0wuPNGmlQNMEfD4.woff2"
  ).then((r) => r.arrayBuffer()).catch(() => null);

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
            padding: "16px 48px",
            display: "flex",
          }}
        >
          <span style={{ fontSize: "80px", fontWeight: "bold", color: "black" }}>
            mylink
          </span>
        </div>
        <span style={{ fontSize: "36px", color: "rgba(255,255,255,0.85)" }}>
          Share all your links in one place
        </span>
      </div>
    ),
    { ...size }
  );
}
