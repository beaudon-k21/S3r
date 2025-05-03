"use client";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useEffect, useState } from "react";

export default function AdminDashboard() {
  const [records, setRecords] = useState([]);
  const [docFilter, setDocFilter] = useState("All");

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("ledger") || "[]");
    const updated = saved.map((rec) =>
      rec.id
        ? rec
        : { ...rec, id: Date.now().toString() + Math.random(), verified: false }
    );
    setRecords(updated);
    localStorage.setItem("ledger", JSON.stringify(updated));
  }, []);

  const updateVerification = (id) => {
    const updated = records.map((rec) =>
      rec.id === id ? { ...rec, verified: !rec.verified } : rec
    );
    setRecords(updated);
    localStorage.setItem("ledger", JSON.stringify(updated));
  };

  const filteredRecords =
    docFilter === "All"
      ? records
      : records.filter((r) => r.docType === docFilter);

  const allDocTypes = ["All", ...new Set(records.map((r) => r.docType))];
  const handleDownload = async (record) => {
    // Create a hidden HTML element for PDF content
    const container = document.createElement("div");
    container.style.width = "600px";
    container.style.padding = "20px";
    container.style.fontFamily = "Arial, sans-serif";
    container.style.border = "1px solid #ccc";
    container.style.background = "white";
    container.innerHTML = `

<div style="display: flex; align-items: center; justify-content: space-between;"> <img src="/assets/logo.png" width="120" /> <img src="/assets/${
      record.verified ? "verified" : "unverified"
    }.png" width="60" /> </div> <h2 style="color: #0070f3; margin-top: 1rem;">Swift Supply Document</h2> <p><strong>Supplier:</strong> ${
      record.supplier
    }</p> <p><strong>Document Type:</strong> ${
      record.docType
    }</p> <p><strong>Expiry Date:</strong> ${
      record.expiry || "—"
    }</p> <p><strong>Blockchain Hash:</strong><br /><code style="font-size: 0.75rem;">${
      record.hash
    }</code></p> <p><strong>Status:</strong> ${
      record.verified ? "Verified" : "Unverified"
    }</p> <p style="margin-top: 1rem; font-size: 0.8rem; color: gray;">Downloaded on ${new Date().toLocaleString()}</p> `;
    document.body.appendChild(container);

    const canvas = await html2canvas(container, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF();
    const width = pdf.internal.pageSize.getWidth();
    const height = (canvas.height * width) / canvas.width;
    pdf.addImage(imgData, "PNG", 0, 0, width, height);
    pdf.save(`${record.supplier}_${record.docType.replace(/\s/g, "_")}.pdf`);

    document.body.removeChild(container);
  };
  const getExpiringSoonCount = () => {
    const now = new Date();
    const sevenDaysFromNow = new Date(now);
    sevenDaysFromNow.setDate(now.getDate() + 7);

    return records.filter((rec) => {
      if (!rec.expiry) return false;
      const expiryDate = new Date(rec.expiry);
      return expiryDate > now && expiryDate <= sevenDaysFromNow;
    }).length;
  };
  const getExpiredCount = () => {
    const now = new Date();
    return records.filter((rec) => {
      if (!rec.expiry) return false;
      const expiryDate = new Date(rec.expiry);
      return expiryDate < now;
    }).length;
  };
  const sortedRecords = [...filteredRecords].sort((a, b) => {
    const aDate = a.expiry ? new Date(a.expiry) : null;
    const bDate = b.expiry ? new Date(b.expiry) : null;

    if (aDate && bDate) return aDate - bDate;
    if (aDate && !bDate) return -1;
    if (!aDate && bDate) return 1;
    return 0;
  });
  return (
    <main className="form-container">
      <h1>Admin Dashboard</h1>
      {records.length === 0 ? (
        <p>No uploaded documents yet.</p>
      ) : (
        <>
          <label>
            {" "}
            Filter by Document Type:{" "}
            <select
              value={docFilter}
              onChange={(e) => setDocFilter(e.target.value)}
              style={{ marginLeft: "1rem", padding: "0.4rem" }}
            >
              {" "}
              {allDocTypes.map((type, idx) => (
                <option key={idx} value={type}>
                  {type}
                </option>
              ))}{" "}
            </select>{" "}
          </label>
          {/* Expiry Alert Banner – outside the select */}
          {getExpiringSoonCount() > 0 && (
            <div
              style={{
                backgroundColor: "#ffe5e5",
                color: "#a70000",
                padding: "1rem",
                borderRadius: "6px",
                marginTop: "1rem",
                fontWeight: "bold",
              }}
            >
              {" "}
              ⚠️ {getExpiringSoonCount()} document{" "}
              {getExpiringSoonCount() > 1 ? "s are" : " is"} expiring within 7
              days!{" "}
            </div>
          )}
          {getExpiredCount() > 0 && (
            <div
              style={{
                backgroundColor: "#fdd",
                color: "#900",
                padding: "1rem",
                borderRadius: "6px",
                marginTop: "1rem",
                fontWeight: "bold",
              }}
            >
              ❌ {getExpiredCount()} document{" "}
              {getExpiredCount() > 1 ? "s have" : "has"} expired!
            </div>
          )}

          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              marginTop: "1.5rem",
            }}
          >
            <thead>
              <tr style={{ borderBottom: "2px solid #ccc" }}>
                <th>Supplier</th>
                <th>Doc Type</th>
                <th>Expiry</th>
                <th>Hash</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedRecords.map((rec, idx) => {
                const expired = rec.expiry && new Date(rec.expiry) < new Date();
                return (
                  <tr
                    key={rec.id}
                    style={{
                      borderBottom: "1px solid #eee",
                      backgroundColor: rec.expiry
                        ? new Date(rec.expiry) < new Date()
                          ? "#ffe5e5"
                          : new Date(rec.expiry) <=
                            new Date(Date.now() + 7 * 24 * 60 * 1000)
                          ? "#fff8dc"
                          : "white"
                        : "white",
                    }}
                  >
                    <td>{rec.supplier}</td>
                    <td>{rec.docType}</td>
                    <td>{rec.expiry || "—"}</td>
                    <td style={{ fontSize: "0.7rem", wordBreak: "break-word" }}>
                      {rec.hash}
                    </td>
                    <td style={{ color: expired ? "red" : "green" }}>
                      {expired
                        ? "Expired"
                        : rec.verified
                        ? "Verified"
                        : "Valid"}
                    </td>
                    <td>
                      <button
                        onClick={() => updateVerification(rec.id)}
                        style={btnStyle}
                      >
                        {rec.verified ? "Unverify" : "Verify"}
                      </button>
                      <button
                        onClick={() => handleDownload(rec)}
                        style={{ ...btnStyle, backgroundColor: "#666" }}
                      >
                        Download
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </>
      )}
    </main>
  );
}

const btnStyle = {
  marginRight: "0.5rem",
  padding: "0.4rem 0.8rem",
  backgroundColor: "#0070f3",
  color: "white",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
};
