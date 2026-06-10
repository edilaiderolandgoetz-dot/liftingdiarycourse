import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const workouts = await prisma.workout.findMany({
    where: { userId },
    include: { exercises: { include: { sets: { orderBy: { order: "asc" } } }, orderBy: { order: "asc" } } },
    orderBy: { date: "desc" },
  });

  return NextResponse.json(workouts);
}

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { name, exercises } = body as {
    name: string;
    exercises: { name: string; sets: { reps: number; weight: number; unit: string }[] }[];
  };

  const workout = await prisma.workout.create({
    data: {
      userId,
      name,
      exercises: {
        create: exercises.map((ex, exIdx) => ({
          name: ex.name,
          order: exIdx,
          sets: {
            create: ex.sets.map((s, sIdx) => ({
              reps: s.reps,
              weight: s.weight,
              unit: s.unit,
              order: sIdx,
            })),
          },
        })),
      },
    },
    include: { exercises: { include: { sets: true } } },
  });

  return NextResponse.json(workout, { status: 201 });
}
