import { ArrowDownNarrowWide, FilterIcon } from "lucide-react";
import TableSearch from "./TableSearch";
import FormModal from "./FormModal";
import { role } from "@/lib/utils-02";

function TableHeader({ heading, table }: { heading: string; table: any }) {
  return (
    <div className="flex items-center justify-between">
      <h1 className="hidden md:block text-lg font-semibold">{heading}</h1>
      <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
        <TableSearch />
        <div className="flex items-center gap-4 self-end">
          <button className="w-8 h-8 flex items-center justify-center rounded-full bg-agriYellow">
            <FilterIcon size={14} />
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded-full bg-agriYellow">
            <ArrowDownNarrowWide size={14} />
          </button>
          {role === "admin" && <FormModal table={table} type="create" />}
        </div>
      </div>
    </div>
  );
}

export default TableHeader;
