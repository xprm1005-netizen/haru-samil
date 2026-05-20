import { ImageResponse } from "next/og";

export const size = { width: 192, height: 192 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 192,
          height: 192,
          borderRadius: 32,
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
            fontSize: 96,
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
