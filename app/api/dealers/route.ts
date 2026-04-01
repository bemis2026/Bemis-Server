import { NextResponse } from "next/server";
import { readFileSync } from "fs";
import path from "path";

const dealersPath = path.join(process.cwd(), "data", "dealers.json");

export async function GET() {
  try {
    const data = JSON.parse(readFileSync(dealersPath, "utf-8"));
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({});
  }
}
