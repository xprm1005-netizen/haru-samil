import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          borderRadius: 40,
          backgroundColor: "#080808",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span
          style={{
            fontFamily: "sans-serif",
            fontWeight: 700,
            fontSize: 90,
            color: "#efefef",
            lineHeight: 1,
          }}
        >
          3
        </span>
      </div>
    ),
    { ...size }
  );
}
