import { NextResponse } from "next/server";
import { readFileSync } from "fs";
import path from "path";
import { readBin } from "../../../lib/jsonbin";

const fallbackPath = path.join(process.cwd(), "data", "dealers.json");

export const revalidate = 60;

export async function GET() {
  try {
    return NextResponse.json(await readBin("dealers"));
  } catch {}
  try {
    return NextResponse.json(JSON.parse(readFileSync(fallbackPath, "utf-8")));
  } catch {
    return NextResponse.json({});
  }
}
