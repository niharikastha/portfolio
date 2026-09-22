import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

/** Gold "A" monogram favicon, generated at build time. */
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#08090a",
          color: "#ffc85c",
          fontSize: 46,
          fontWeight: 700,
        }}
      >
        A
      </div>
    ),
    size,
  );
}
