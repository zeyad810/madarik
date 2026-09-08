"use client";

export function PackagesLoadError({ retry, isFetching }: { retry: () => void; isFetching: boolean }) {
  return (
    <div role="alert" className="mx-auto my-8 max-w-md rounded-3xl border border-gray-200 bg-gray-50 p-6 text-center">
      <p className="text-sm font-semibold text-gray-700">تعذر تحميل الباقات حالياً</p>
      <p className="mt-2 text-xs text-gray-500">يرجى إعادة المحاولة بعد قليل.</p>
      <button type="button" onClick={retry} disabled={isFetching} className="mt-4 rounded-xl bg-mad-main px-5 py-2 text-sm font-bold text-white disabled:opacity-50 cursor-pointer">
        {isFetching ? "جاري المحاولة..." : "إعادة المحاولة"}
      </button>
    </div>
  );
}
