import { NextResponse } from "next/server";
import { upsertProject } from "@/actions";

export async function POST(request: Request) {
  const { values, userId } = await request.json();

  if (!values || !userId) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  try {
    const project = await upsertProject(values, userId);
    return NextResponse.json(project);
  } catch (error) {
    console.error("Error in POST /api/upsertProject:", error);
    return NextResponse.json(
      { error: "Failed to upsert project" },
      { status: 500 }
    );
  }
}
