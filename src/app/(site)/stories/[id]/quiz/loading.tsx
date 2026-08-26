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

          {/* 2. CENTER COLUMN — Main Quiz */}
          <section className="lg:col-span-6 flex flex-col items-center w-full max-w-2xl mx-auto">
            {/* Exit button placeholder */}
            <div className="w-full flex justify-end mb-4">
              <div className="w-10 h-10 rounded-2xl bg-red-50 animate-pulse" />
            </div>

            {/* 2 Metric Cards Skeleton */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4 w-full mb-6">
              <div className="bg-white rounded-[24px] p-5 shadow-sm border border-slate-100 flex flex-col items-center justify-center gap-3 min-h-[145px]">
                <div className="h-3 w-16 rounded-full bg-slate-200 animate-pulse" />
                <div className="size-16 rounded-full bg-purple-100 animate-pulse" />
              </div>
              <div className="bg-white rounded-[24px] p-5 shadow-sm border border-slate-100 flex flex-col items-center justify-between gap-2 min-h-[145px]">
                <div className="size-10 rounded-full bg-yellow-100 animate-pulse" />
                <div className="h-3 w-12 rounded-full bg-slate-200 animate-pulse" />
                <div className="h-6 w-10 rounded-full bg-purple-200 animate-pulse" />
                <div className="h-2.5 w-24 rounded-full bg-emerald-100 animate-pulse" />
              </div>
            </div>

            {/* Stepper Timeline Skeleton */}
            <div className="w-full mb-5 flex flex-col items-center gap-3">
              <div className="h-4 w-28 rounded-full bg-purple-200 animate-pulse" />
              <div className="flex items-center gap-2">
                <div className="size-8 rounded-full bg-purple-100 animate-pulse" />
                <div className="h-0.5 w-6 bg-slate-200" />
                <div className="size-7 rounded-full bg-purple-200 animate-pulse" />
                <div className="h-0.5 w-6 bg-slate-200" />
                <div className="size-7 rounded-full bg-slate-100 animate-pulse" />
                <div className="h-0.5 w-6 bg-slate-200" />
                <div className="size-8 rounded-full bg-slate-100 animate-pulse" />
              </div>
            </div>

            {/* Question Card Skeleton */}
            <div className="w-full bg-white rounded-[28px] border border-slate-100 p-6 sm:p-8 shadow-sm flex flex-col gap-6">
              <div className="mx-auto h-7 w-64 rounded-full bg-purple-100 animate-pulse" />
              <div className="mx-auto h-6 w-[80%] rounded-full bg-slate-200 animate-pulse" />

              <div className="flex flex-col gap-3.5">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-14 animate-pulse rounded-2xl border border-slate-100 bg-slate-50"
                    style={{ animationDelay: `${i * 70}ms` }}
                  />
                ))}
              </div>
            </div>

            {/* Bottom Actions Skeleton */}
            <div className="flex items-center justify-between gap-4 mt-6 w-full">
              <div className="h-11 w-36 rounded-full bg-purple-200 animate-pulse" />
              <div className="h-11 w-32 rounded-full bg-slate-100 animate-pulse" />
            </div>
          </section>

          {/* 3. LEFT COLUMN — Spacer */}
          <aside className="lg:col-span-3 hidden lg:block" />
        </div>
      </main>
    </div>
  );
}
