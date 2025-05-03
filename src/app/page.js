"use client";
import Link from "next/link";

export default function Home() {
  return (
    <main style={{ padding: "2rem" }}>
      <h1>Swift Supply Circular Portal</h1>
      <p>Welcome to the blockchain-backed sustainability dashboard.</p>
      <div style={{ marginTop: "1.5rem", display: "flex", gap: "1rem" }}>
        <Link href="/recycling" style={linkStyle}>
          Upload Document
        </Link>
        <Link href="/dashboard" style={linkStyle}>
          View Supplier Dashboard
        </Link>
        <Link href="/ledger" style={linkStyle}>
          Ledger Timeline
        </Link>
      </div>
    </main>
  );
}

const linkStyle = {
  padding: "0.5rem 1rem",
  backgroundColor: "#0070f3",
  color: "white",
  borderRadius: "6px",
  textDecoration: "none",
};
