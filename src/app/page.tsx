import { SignInButton, SignUpButton, Show } from "@clerk/nextjs";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col">
      <Show when="signed-out">
        <Hero />
      </Show>
      <Show when="signed-in">
        <Dashboard />
      </Show>
    </main>
  );
}

function Hero() {
  return (
    <section className="flex flex-1 flex-col items-center justify-center px-6 py-24 text-center">
      <span className="mb-4 inline-block rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
        Track every rep. Own every PR.
      </span>
      <h1 className="max-w-2xl text-5xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-6xl">
        Your personal lifting diary
      </h1>
      <p className="mt-6 max-w-lg text-lg text-zinc-500 dark:text-zinc-400">
        Log your workouts, track your progress, and crush your personal records
        — all in one place.
      </p>
      <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
        <SignUpButton mode="modal">
          <button className="rounded-full bg-zinc-900 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200">
            Get started for free
          </button>
        </SignUpButton>
        <SignInButton mode="modal">
          <button className="rounded-full border border-zinc-200 px-6 py-3 text-sm font-semibold text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800">
            Sign in
          </button>
        </SignInButton>
      </div>
      <div className="mt-20 grid w-full max-w-3xl grid-cols-1 gap-6 sm:grid-cols-3">
        {features.map((f) => (
          <div
            key={f.title}
            className="rounded-2xl border border-zinc-100 bg-white p-6 text-left dark:border-zinc-800 dark:bg-zinc-900"
          >
            <div className="mb-3 text-2xl">{f.icon}</div>
            <h3 className="font-semibold text-zinc-900 dark:text-white">{f.title}</h3>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{f.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

const features = [
  {
    icon: "🏋️",
    title: "Log workouts",
    description: "Record sets, reps, and weights for any exercise in seconds.",
  },
  {
    icon: "📈",
    title: "Track progress",
    description: "See your strength gains over time with clear session history.",
  },
  {
    icon: "🏆",
    title: "Hit PRs",
    description: "Personal records are automatically detected and celebrated.",
  },
];

function Dashboard() {
  return (
    <section className="flex flex-1 flex-col px-6 py-10 sm:px-10">
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">Your workouts</h2>
        <button className="rounded-full bg-zinc-900 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200">
          + Log workout
        </button>
      </div>
      <EmptyState />
    </section>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-200 py-24 text-center dark:border-zinc-700">
      <span className="text-4xl">🏋️</span>
      <h3 className="mt-4 font-semibold text-zinc-900 dark:text-white">No workouts yet</h3>
      <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
        Log your first session to start tracking your progress.
      </p>
    </div>
  );
}
