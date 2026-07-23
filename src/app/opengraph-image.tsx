import { ImageResponse } from "next/og";

/**
 * Default Open Graph image (TZ doc 18 §5). Generated at the edge from the
 * brand wordmark so social shares have a consistent, on-brand card without a
 * static asset. Per-template dynamic OG images ship with the SEO milestone.
 */
export const runtime = "edge";
export const alt = "Turon Avtomaktab";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          gap: 24,
          padding: 96,
          background: "linear-gradient(135deg, #172554 0%, #1d4ed8 100%)",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 84,
              height: 84,
              borderRadius: 20,
              background: "white",
              color: "#1d4ed8",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 52,
              fontWeight: 900,
            }}
          >
            T
          </div>
          <div style={{ fontSize: 46, fontWeight: 800 }}>Turon Avtomaktab</div>
        </div>
        <div style={{ fontSize: 62, fontWeight: 800, lineHeight: 1.1, maxWidth: 900 }}>
          {"Haydovchilik guvohnomasiga ishonchli yo'l"}
        </div>
        <div style={{ fontSize: 30, color: "#bfd7fe" }}>
          {"7 filial · O'z avtodromi · Namangan"}
        </div>
      </div>
    ),
    size,
  );
}
