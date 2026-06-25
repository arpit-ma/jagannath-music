import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Read file data as ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Ensure the public/uploads directory exists
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadDir, { recursive: true });

    // Clean name to prevent path traversals and add unique timestamp prefix
    const safeFileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
    const filePath = path.join(uploadDir, safeFileName);

    // Save the file to the local directory
    await fs.writeFile(filePath, buffer);

    // Return the relative URL path that will be served by Next.js static files
    return NextResponse.json({ url: `/uploads/${safeFileName}` });
  } catch (err) {
    console.error("Image upload API error:", err);
    return NextResponse.json({ error: "Failed to upload image" }, { status: 500 });
  }
}
