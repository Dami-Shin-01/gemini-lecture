interface ComparisonTableProps {
  headers: string[];
  rows: { label: string; cells: string[] }[];
  highlight?: number;
}

export function ComparisonTable({ headers = [], rows = [], highlight }: ComparisonTableProps) {
  if (!headers.length || !rows.length) return null;
  return (
    <div className="my-6 overflow-x-auto rounded-lg border border-cream-dark">
      <table className="w-full min-w-[480px] border-collapse text-sm">
        <thead>
          <tr className="bg-cream-dark">
            <th className="px-4 py-3 text-left font-semibold text-text-primary" />
            {headers.map((header, i) => (
              <th
                key={i}
                className="px-4 py-3 text-left font-semibold text-text-primary"
                style={
                  highlight === i
                    ? { backgroundColor: "var(--color-accent-light)" }
                    : undefined
                }
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr
              key={ri}
              className="border-t border-cream-dark"
            >
              <td className="px-4 py-3 font-medium text-text-primary">
                {row.label}
              </td>
              {row.cells.map((cell, ci) => (
                <td
                  key={ci}
                  className="px-4 py-3 text-text-secondary"
                  style={
                    highlight === ci
                      ? { backgroundColor: "var(--color-accent-light)" }
                      : undefined
                  }
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
