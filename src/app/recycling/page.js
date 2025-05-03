"use client";

import { useState } from "react";

export default function RecyclingUploadPage() {
  const [formData, setFormData] = useState({
    supplier: "",
    docType: "",
    expiry: "",
    file: null,
  });
  const [hash, setHash] = useState(null);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({ ...prev, [name]: files ? files[0] : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.file) {
      alert("Please upload a file.");
      return;
    }

    const fileBuffer = await formData.file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest("SHA-256", fileBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    const newRecord = {
      id: Date.now().toString(), // Unique timestamp ID
      supplier: formData.supplier,
      docType: formData.docType,
      expiry: formData.expiry,
      hash: hashHex,
      date: new Date().toISOString(),
      verified: false, // Optional: add this if you want the verify toggle logic to work
    };

    const ledger = JSON.parse(localStorage.getItem("ledger") || "[]");
    ledger.push(newRecord);
    localStorage.setItem("ledger", JSON.stringify(ledger));

    setHash(hashHex);
    alert("Document uploaded and hashed to blockchain (simulated)");
  };
  return (
    <main className="form-container">
      {" "}
      <h1>Upload Recycling Document</h1>{" "}
      <form onSubmit={handleSubmit}>
        {" "}
        <label>
          {" "}
          Supplier Name:{" "}
          <input
            type="text"
            name="supplier"
            value={formData.supplier}
            onChange={handleChange}
            required
          />{" "}
        </label>
        <label>
          Document Type:
          <select
            name="docType"
            value={formData.docType}
            onChange={handleChange}
            required
          >
            <option value="">Select type</option>
            <option value="Recycled Material Certificate">
              Recycled Material Certificate
            </option>
            <option value="Reuse Declaration">Reuse Declaration</option>
            <option value="End-of-Life Report">End-of-Life Report</option>
          </select>
        </label>
        <label>
          Expiry Date:
          <input
            type="date"
            name="expiry"
            value={formData.expiry}
            onChange={handleChange}
          />
        </label>
        <label>
          Upload File:
          <input type="file" name="file" onChange={handleChange} required />
        </label>
        <button type="submit">Submit</button>
      </form>
      {hash && (
        <div style={{ marginTop: "2rem", wordBreak: "break-all" }}>
          <h3>Simulated Blockchain Transaction Hash:</h3>
          <code>{hash}</code>
        </div>
      )}
    </main>
  );
}
