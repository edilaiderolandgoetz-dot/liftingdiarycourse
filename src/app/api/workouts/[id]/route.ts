import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const workout = await prisma.workout.findUnique({ where: { id } });
  if (!workout || workout.userId !== userId)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  await prisma.workout.delete({ where: { id } });
  return new NextResponse(null, { status: 204 });
}
