"use client";

import { ITEM_PER_PAGE } from "@/lib/settings";
import { useRouter } from "next/navigation";

const Pagination = ({ page, count }: { page: number; count: number }) => {
  const router = useRouter(); //useRouter is a hook that returns the router object. You should use this hook if you need to access the router object in a component outside of the page component.

  const hasPrev = ITEM_PER_PAGE * (page - 1) > 0;
  const hasNext = ITEM_PER_PAGE * page < count;

  const changePage = (newPage: number) => {
    const params = new URLSearchParams(window.location.search);
    params.set("page", newPage.toString());
    router.push(`${window.location.pathname}?${params}`);
  };

  return (
    <div className="p-4 flex items-center justify-between text-gray-500">
      <button
        disabled={!hasPrev}
        className="py-2 px-4 rounded-md bg-slate-200 text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={() => changePage(page - 1)}
      >
        Prev
      </button>
      <div className="flex items-center gap-2 text-sm">
        {Array.from(
          {
            length: Math.ceil(count / ITEM_PER_PAGE),
          },
          (_, idx) => {
            const pageIdx = idx + 1;
            return (
              <button
                key={pageIdx}
                className={`px-2 rounded-sm ${
                  pageIdx === page ? "bg-agriSky" : ""
                }`}
                onClick={() => changePage(pageIdx)}
              >
                {pageIdx}
              </button>
            );
          }
        )}
      </div>
      <button
        className="py-2 px-4 rounded-md bg-slate-200 text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={() => changePage(page + 1)}
        disabled={!hasNext}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
