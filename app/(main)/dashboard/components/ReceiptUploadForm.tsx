"use client";

import { useActionState, useState } from "react";

export function ReceiptUploadForm() {
  const [preview, setPreview] = useState<string | null>(null);

  const [result, action, pending] = useActionState(async (_prev: string, formData: FormData) => {
    const file = formData.get("receipt") as File | null;
    if (!file || file.size === 0) return "error:Please select an image.";

    const response = await fetch("/api/receipts", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    if (!response.ok) return `error:${data.error ?? "Upload failed"}`;
    return "success";
  }, "");

  const isError = result.startsWith("error:");
  const errorMessage = isError ? result.slice(6) : "";

  return (
    <form action={action} style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 400 }}>
      <label>
        Receipt Image
        <input
          name="receipt"
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            setPreview(file ? URL.createObjectURL(file) : null);
          }}
          style={{ display: "block", marginTop: 4 }}
        />
      </label>

      {preview && (
        <img src={preview} alt="Preview" style={{ maxWidth: "100%", maxHeight: 200, objectFit: "contain" }} />
      )}

      <button type="submit" disabled={pending}>
        {pending ? "Uploading…" : "Upload Receipt"}
      </button>

      {isError && <p style={{ color: "red" }}>{errorMessage}</p>}
      {result === "success" && <p style={{ color: "green" }}>Receipt uploaded successfully</p>}
    </form>
  );
}
