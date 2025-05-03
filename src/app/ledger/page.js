"use client";

import { useEffect, useState } from "react";

export default function LedgerPage() {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("ledger") || "[]");
    setRecords(saved);
  }, []);

  return (
    <main className="form-container">
      <h1>Blockchain Ledger (Simulated)</h1>
      {records.length === 0 ? (
        <p>No documents submitted yet.</p>
      ) : (
        <ul style={{ paddingLeft: 0 }}>
          {records.map((record, idx) => (
            <li key={idx} style={{ marginBottom: "1.2rem", listStyle: "none" }}>
              <strong>{record.supplier}</strong> uploaded a{" "}
              <em>{record.docType}</em>
              <br />
              Expiry: {record.expiry || "None"}
              <br />
              <span style={{ fontSize: "0.85rem" }}>Hash:</span>
              <code style={{ wordBreak: "break-word", fontSize: "0.75rem" }}>
                {record.hash}
              </code>
              <hr />
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
