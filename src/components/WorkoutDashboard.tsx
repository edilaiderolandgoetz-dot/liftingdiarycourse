"use client";

import { useEffect, useState } from "react";
import WorkoutLogger from "./WorkoutLogger";

type SetData = { id: string; reps: number; weight: number; unit: string; order: number };
type ExerciseData = { id: string; name: string; order: number; sets: SetData[] };
type WorkoutData = {
  id: string;
  name: string;
  date: string;
  exercises: ExerciseData[];
};

async function loadWorkouts() {
  const res = await fetch("/api/workouts");
  return res.json() as Promise<WorkoutData[]>;
}

export default function WorkoutDashboard() {
  const [workouts, setWorkouts] = useState<WorkoutData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showLogger, setShowLogger] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    loadWorkouts().then((data) => {
      setWorkouts(data);
      setLoading(false);
    });
  }, []);

  function refresh() {
    setLoading(true);
    loadWorkouts().then((data) => {
      setWorkouts(data);
      setLoading(false);
    });
  }

  function handleSaved() {
    setShowLogger(false);
    refresh();
  }

  async function handleDelete(id: string) {
    setDeleting(id);
    await fetch(`/api/workouts/${id}`, { method: "DELETE" });
    setWorkouts((prev) => prev.filter((w) => w.id !== id));
    setDeleting(null);
  }

  return (
    <section className="flex flex-1 flex-col px-6 py-10 sm:px-10 max-w-3xl w-full mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">Your workouts</h2>
        <button
          onClick={() => setShowLogger((v) => !v)}
          className="rounded-full bg-zinc-900 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          {showLogger ? "Cancel" : "+ Log workout"}
        </button>
      </div>

      {showLogger && (
        <div className="mb-8 rounded-2xl border border-zinc-100 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <h3 className="mb-4 font-semibold text-zinc-900 dark:text-white">New workout</h3>
          <WorkoutLogger onSaved={handleSaved} />
        </div>
      )}

      {loading ? (
        <div className="flex flex-1 items-center justify-center text-zinc-400 text-sm">Loading…</div>
      ) : workouts.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-200 py-24 text-center dark:border-zinc-700">
          <span className="text-4xl">🏋️</span>
          <h3 className="mt-4 font-semibold text-zinc-900 dark:text-white">No workouts yet</h3>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
            Log your first session to start tracking your progress.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {workouts.map((w) => (
            <WorkoutCard key={w.id} workout={w} onDelete={handleDelete} deleting={deleting === w.id} />
          ))}
        </div>
      )}
    </section>
  );
}

function WorkoutCard({
  workout,
  onDelete,
  deleting,
}: {
  workout: WorkoutData;
  onDelete: (id: string) => void;
  deleting: boolean;
}) {
  const date = new Date(workout.date).toLocaleDateString("en-GB", {
    weekday: "short", day: "numeric", month: "short", year: "numeric",
  });

  const totalSets = workout.exercises.reduce((acc, ex) => acc + ex.sets.length, 0);

  return (
    <div className="rounded-2xl border border-zinc-100 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-semibold text-zinc-900 dark:text-white">{workout.name}</h3>
          <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
            {date} · {workout.exercises.length} exercise{workout.exercises.length !== 1 ? "s" : ""} · {totalSets} set{totalSets !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          onClick={() => onDelete(workout.id)}
          disabled={deleting}
          className="text-xs text-zinc-400 hover:text-red-500 transition-colors disabled:opacity-50"
        >
          {deleting ? "Deleting…" : "Delete"}
        </button>
      </div>

      <div className="mt-4 space-y-3">
        {workout.exercises.map((ex) => (
          <div key={ex.id}>
            <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{ex.name}</p>
            <div className="mt-1 flex flex-wrap gap-2">
              {ex.sets.map((s, i) => (
                <span
                  key={s.id}
                  className="rounded-md bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                >
                  {i + 1}. {s.reps} × {s.weight}{s.unit}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
