export default function QuizLoading() {
  return (
    <div
      dir="rtl"
      className="min-h-screen flex flex-col justify-between bg-[#FAFAFC] relative overflow-hidden select-none"
    >
      {/* ── TOP HEADER & BREADCRUMBS ── */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-6 pb-2">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-3">
          <div className="h-3.5 w-14 rounded-full bg-purple-200 animate-pulse" />
          <div className="h-3 w-2 rounded-full bg-slate-200 animate-pulse" />
          <div className="h-3.5 w-20 rounded-full bg-slate-200 animate-pulse" />
          <div className="h-3 w-2 rounded-full bg-slate-200 animate-pulse" />
          <div className="h-3.5 w-28 rounded-full bg-slate-200 animate-pulse" />
        </div>

        {/* Header Title & Level Badges */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="h-8 w-64 rounded-full bg-slate-200 animate-pulse" />
          <div className="flex items-center gap-2">
            <div className="h-6 w-20 rounded-full bg-green-100 animate-pulse" />
            <div className="h-6 w-24 rounded-full bg-purple-100 animate-pulse" />
          </div>
        </div>
      </div>

      {/* ── 3-COLUMN MAIN CONTENT ── */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-4 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">

          {/* 1. RIGHT COLUMN — Character Illustration */}
          <aside className="lg:col-span-3 hidden lg:flex flex-col items-center justify-center pt-2">
            <div className="w-[280px] h-[400px] rounded-[32px] bg-slate-100 animate-pulse" />
          </aside>

          {/* 2. CENTER COLUMN — Question Card */}
          <section className="lg:col-span-6 flex flex-col gap-5">
            {/* Progress bar */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between">
                <div className="h-3 w-20 rounded-full bg-slate-200 animate-pulse" />
                <div className="h-3 w-12 rounded-full bg-slate-200 animate-pulse" />
              </div>
              <div className="w-full h-2.5 rounded-full bg-slate-200 overflow-hidden">
                <div className="h-full w-1/3 rounded-full bg-purple-300 animate-pulse" />
              </div>
            </div>

            {/* Question Card */}
            <div className="w-full bg-white rounded-[32px] border border-border p-8 sm:p-10 shadow-sm flex flex-col gap-7 min-h-[500px]">
              {/* Question text */}
              <div className="mx-auto flex flex-col gap-3 w-full items-center">
                <div className="h-6 w-[85%] rounded-full bg-slate-200 animate-pulse" />
                <div className="h-5 w-[60%] rounded-full bg-slate-100 animate-pulse" />
              </div>

              {/* Answer options */}
              <div className="flex flex-col gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-16 animate-pulse rounded-[20px] border border-slate-100 bg-slate-50"
                    style={{ animationDelay: `${i * 80}ms` }}
                  />
                ))}
              </div>

              {/* Action buttons */}
              <div className="flex items-center justify-between mt-auto pt-4">
                <div className="h-11 w-28 rounded-full bg-slate-100 animate-pulse" />
                <div className="h-11 w-32 rounded-full bg-purple-200 animate-pulse" />
              </div>
            </div>
          </section>

          {/* 3. LEFT COLUMN — Sidebar */}
          <aside className="lg:col-span-3 hidden lg:flex flex-col gap-4">
            {/* Timer card */}
            <div className="bg-white rounded-[24px] border border-border p-5 shadow-sm flex flex-col items-center gap-3">
              <div className="h-4 w-16 rounded-full bg-slate-200 animate-pulse" />
              <div className="size-20 rounded-full bg-purple-100 animate-pulse" />
            </div>

            {/* Points card */}
            <div className="bg-white rounded-[24px] border border-border p-5 shadow-sm flex flex-col items-center gap-3">
              <div className="h-4 w-20 rounded-full bg-slate-200 animate-pulse" />
              <div className="h-10 w-16 rounded-full bg-yellow-100 animate-pulse" />
            </div>

            {/* Questions list skeleton */}
            <div className="bg-white rounded-[24px] border border-border p-5 shadow-sm flex flex-col gap-3">
              <div className="h-4 w-24 rounded-full bg-slate-200 animate-pulse mb-1" />
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="h-7 w-7 rounded-full bg-slate-100 animate-pulse mx-auto"
                  style={{ animationDelay: `${i * 60}ms` }}
                />
              ))}
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
