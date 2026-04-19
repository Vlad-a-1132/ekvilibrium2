import { cn } from "@/lib/utils";

export type SpecRow = {
  label: string;
  value: string;
};

type ProductSpecsTableProps = {
  rows: SpecRow[];
  className?: string;
};

export function ProductSpecsTable({ rows, className }: ProductSpecsTableProps) {
  if (rows.length === 0) return null;

  return (
    <div className={cn("overflow-hidden rounded-2xl border border-[#403A34]/10 bg-[#fbf8f4]/40", className)}>
      <p className="border-b border-[#403A34]/10 bg-[#f6f1eb]/80 px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-[#403A34]/55">
        Характеристики
      </p>
      <table className="w-full text-left text-sm">
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={`${row.label}-${i}`}
              className="border-b border-dotted border-[#403A34]/12 transition-colors last:border-b-0 hover:bg-[#403A34]/[0.04]"
            >
              <th
                scope="row"
                className="w-[40%] max-w-[12rem] py-3 pl-4 pr-2 font-normal text-[#403A34]/60"
              >
                {row.label}
              </th>
              <td className="py-3 pr-4 font-medium text-[#403A34]">{row.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
