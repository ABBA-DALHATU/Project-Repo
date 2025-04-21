import { db } from "@/lib/prismaClient";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const supervisors = await db.user.findMany({
      where: { role: "SUPERVISOR" },
    });
    return NextResponse.json(supervisors);
  } catch (error) {
    console.error("Error fetching supervisors:", error);
    return NextResponse.error();
  }
}
