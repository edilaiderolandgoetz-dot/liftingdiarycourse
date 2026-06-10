"use client";

import { useState } from "react";

type SetDraft = { reps: string; weight: string; unit: "kg" | "lbs" };
type ExerciseDraft = { name: string; sets: SetDraft[] };

const emptySet = (): SetDraft => ({ reps: "", weight: "", unit: "kg" });
const emptyExercise = (): ExerciseDraft => ({ name: "", sets: [emptySet()] });

export default function WorkoutLogger({ onSaved }: { onSaved: () => void }) {
  const [name, setName] = useState("");
  const [exercises, setExercises] = useState<ExerciseDraft[]>([emptyExercise()]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function updateExercise(i: number, patch: Partial<ExerciseDraft>) {
    setExercises((prev) => prev.map((ex, idx) => (idx === i ? { ...ex, ...patch } : ex)));
  }

  function updateSet(exIdx: number, sIdx: number, patch: Partial<SetDraft>) {
    setExercises((prev) =>
      prev.map((ex, i) =>
        i !== exIdx
          ? ex
          : { ...ex, sets: ex.sets.map((s, j) => (j === sIdx ? { ...s, ...patch } : s)) }
      )
    );
  }

  function addSet(exIdx: number) {
    setExercises((prev) =>
      prev.map((ex, i) => (i === exIdx ? { ...ex, sets: [...ex.sets, emptySet()] } : ex))
    );
  }

  function removeSet(exIdx: number, sIdx: number) {
    setExercises((prev) =>
      prev.map((ex, i) =>
        i !== exIdx ? ex : { ...ex, sets: ex.sets.filter((_, j) => j !== sIdx) }
      )
    );
  }

  function addExercise() {
    setExercises((prev) => [...prev, emptyExercise()]);
  }

  function removeExercise(i: number) {
    setExercises((prev) => prev.filter((_, idx) => idx !== i));
  }

  async function handleSave() {
    setError("");
    if (!name.trim()) { setError("Give this workout a name."); return; }
    for (const ex of exercises) {
      if (!ex.name.trim()) { setError("All exercises need a name."); return; }
      for (const s of ex.sets) {
        if (!s.reps || !s.weight) { setError("Fill in reps and weight for every set."); return; }
      }
    }

    setSaving(true);
    try {
      const res = await fetch("/api/workouts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          exercises: exercises.map((ex) => ({
            name: ex.name,
            sets: ex.sets.map((s) => ({
              reps: Number(s.reps),
              weight: Number(s.weight),
              unit: s.unit,
            })),
          })),
        }),
      });
      if (!res.ok) throw new Error("Failed to save");
      onSaved();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
          Workout name
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Push day, Leg day…"
          className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:focus:ring-white"
        />
      </div>

      <div className="space-y-4">
        {exercises.map((ex, exIdx) => (
          <div
            key={exIdx}
            className="rounded-xl border border-zinc-100 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900"
          >
            <div className="flex items-center gap-2 mb-3">
              <input
                type="text"
                value={ex.name}
                onChange={(e) => updateExercise(exIdx, { name: e.target.value })}
                placeholder="Exercise name"
                className="flex-1 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:focus:ring-white"
              />
              {exercises.length > 1 && (
                <button
                  onClick={() => removeExercise(exIdx)}
                  className="text-zinc-400 hover:text-red-500 transition-colors text-lg leading-none"
                >
                  ×
                </button>
              )}
            </div>

            <div className="space-y-2">
              <div className="grid grid-cols-[2rem_1fr_1fr_1fr_auto] gap-2 text-xs font-medium text-zinc-500 dark:text-zinc-400 px-1">
                <span>#</span><span>Reps</span><span>Weight</span><span>Unit</span><span />
              </div>
              {ex.sets.map((s, sIdx) => (
                <div key={sIdx} className="grid grid-cols-[2rem_1fr_1fr_1fr_auto] gap-2 items-center">
                  <span className="text-xs text-zinc-400 text-center">{sIdx + 1}</span>
                  <input
                    type="number"
                    min="1"
                    value={s.reps}
                    onChange={(e) => updateSet(exIdx, sIdx, { reps: e.target.value })}
                    placeholder="10"
                    className="rounded-lg border border-zinc-200 bg-white px-2 py-1.5 text-sm text-center text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:focus:ring-white"
                  />
                  <input
                    type="number"
                    min="0"
                    step="0.5"
                    value={s.weight}
                    onChange={(e) => updateSet(exIdx, sIdx, { weight: e.target.value })}
                    placeholder="60"
                    className="rounded-lg border border-zinc-200 bg-white px-2 py-1.5 text-sm text-center text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:focus:ring-white"
                  />
                  <select
                    value={s.unit}
                    onChange={(e) => updateSet(exIdx, sIdx, { unit: e.target.value as "kg" | "lbs" })}
                    className="rounded-lg border border-zinc-200 bg-white px-2 py-1.5 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:focus:ring-white"
                  >
                    <option value="kg">kg</option>
                    <option value="lbs">lbs</option>
                  </select>
                  {ex.sets.length > 1 && (
                    <button
                      onClick={() => removeSet(exIdx, sIdx)}
                      className="text-zinc-400 hover:text-red-500 transition-colors text-lg leading-none"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
            </div>

            <button
              onClick={() => addSet(exIdx)}
              className="mt-3 text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"
            >
              + Add set
            </button>
          </div>
        ))}
      </div>

      <button
        onClick={addExercise}
        className="w-full rounded-xl border border-dashed border-zinc-200 py-3 text-sm text-zinc-500 hover:border-zinc-400 hover:text-zinc-700 transition-colors dark:border-zinc-700 dark:hover:border-zinc-500 dark:hover:text-zinc-300"
      >
        + Add exercise
      </button>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <button
        onClick={handleSave}
        disabled={saving}
        className="w-full rounded-full bg-zinc-900 py-3 text-sm font-semibold text-white transition-colors hover:bg-zinc-700 disabled:opacity-50 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
      >
        {saving ? "Saving…" : "Save workout"}
      </button>
    </div>
  );
}
