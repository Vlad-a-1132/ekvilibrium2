import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";

import { NextResponse } from "next/server";

import { isAdminAuthenticated } from "@/lib/auth/admin";

const MAX_BYTES = 5 * 1024 * 1024;

const MIME_TO_EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

function extFromFile(file: File): string | null {
  const mime = file.type?.toLowerCase() ?? "";
  if (MIME_TO_EXT[mime]) return MIME_TO_EXT[mime];
  const name = file.name?.toLowerCase() ?? "";
  if (name.endsWith(".jpg") || name.endsWith(".jpeg")) return "jpg";
  if (name.endsWith(".png")) return "png";
  if (name.endsWith(".webp")) return "webp";
  return null;
}

/**
 * POST multipart/form-data, поле `file`.
 * Сохраняет в public/uploads/products/{uuid}/{uuid}.ext
 */
export async function POST(req: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: "INVALID_FORM" }, { status: 400 });
  }

  const entry = formData.get("file");
  if (!(entry instanceof File) || entry.size === 0) {
    return NextResponse.json({ error: "FILE_REQUIRED" }, { status: 400 });
  }

  if (entry.size > MAX_BYTES) {
    return NextResponse.json({ error: "FILE_TOO_LARGE", maxBytes: MAX_BYTES }, { status: 413 });
  }

  const ext = extFromFile(entry);
  if (!ext) {
    return NextResponse.json(
      { error: "UNSUPPORTED_TYPE", allowed: ["image/jpeg", "image/png", "image/webp"] },
      { status: 415 },
    );
  }

  const folder = randomUUID();
  const filename = `${randomUUID()}.${ext}`;
  const relativeDir = path.join("public", "uploads", "products", folder);
  const absoluteDir = path.join(process.cwd(), relativeDir);
  const absolutePath = path.join(absoluteDir, filename);

  await mkdir(absoluteDir, { recursive: true });

  const buffer = Buffer.from(await entry.arrayBuffer());
  await writeFile(absolutePath, buffer);

  const publicPath = `/uploads/products/${folder}/${filename}`;
  return NextResponse.json({ path: publicPath });
}

export async function GET() {
  return NextResponse.json(
    { ok: true, info: "POST multipart/form-data с полем file (jpg, png, webp, до 5 МБ)." },
    { status: 200 },
  );
}
