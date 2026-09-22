import { ImageResponse } from "next/og";
import { metrics, profile } from "@/content/site";

export const alt = `${profile.name} — ${profile.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * The card LinkedIn, Twitter and Slack render when the link is shared.
 * Uses the runtime's default font only — no network font fetch at build time.
 */
export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#08090a",
          padding: "70px",
        }}
      >
        {/* top row */}
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <div
            style={{
              width: "10px",
              height: "10px",
              borderRadius: "999px",
              backgroundColor: "#ffc85c",
            }}
          />
          <div
            style={{
              fontSize: "20px",
              letterSpacing: "4px",
              color: "#a4abb3",
              textTransform: "uppercase",
            }}
          >
            {profile.availableLabel}
          </div>
        </div>

        {/* headline */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: "86px",
              fontWeight: 700,
              color: "#edeef0",
              letterSpacing: "-3px",
              lineHeight: 1.05,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <span>{profile.name}</span>
          </div>
          <div style={{ fontSize: "38px", color: "#ffc85c", marginTop: "14px" }}>
            {profile.role}
          </div>
          <div style={{ fontSize: "26px", color: "#a4abb3", marginTop: "18px" }}>
            RAG · pgvector · LLM pipelines · Node.js · Next.js
          </div>
        </div>

        {/* metric strip */}
        <div style={{ display: "flex", gap: "56px" }}>
          {metrics.map((m) => (
            <div key={m.label} style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ fontSize: "44px", fontWeight: 700, color: "#edeef0" }}>
                {`${m.value.toLocaleString("en-US")}${m.suffix}`}
              </div>
              <div style={{ fontSize: "19px", color: "#6b737b", marginTop: "6px" }}>
                {m.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
    size,
  );
}
