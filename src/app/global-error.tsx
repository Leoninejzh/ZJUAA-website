"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <div style={{ padding: "2rem", textAlign: "center", fontFamily: "sans-serif" }}>
          <h1 style={{ color: "#c00" }}>应用错误</h1>
          <p style={{ color: "#666", marginBottom: "1.5rem" }}>
            请确保已配置：DATABASE_URL、NEXTAUTH_SECRET、NEXTAUTH_URL、ADMIN_USERNAME、ADMIN_PASSWORD
          </p>
          <button
            onClick={() => reset()}
            style={{
              padding: "0.5rem 1.5rem",
              background: "#003f87",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            重试
          </button>
        </div>
      </body>
    </html>
  );
}
