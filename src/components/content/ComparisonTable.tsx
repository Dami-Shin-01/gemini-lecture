interface ComparisonTableProps {
  headers: string[];
  rows: { label: string; cells: string[] }[];
  highlight?: number;
}

export function ComparisonTable({ headers = [], rows = [], highlight }: ComparisonTableProps) {
  if (!headers.length || !rows.length) return null;

  // headers 개수와 rows의 열 개수(label + cells)가 일치하는지 확인
  // 일치하면: label이 첫 번째 열, cells가 나머지 열
  // 불일치하면: 빈 헤더 + headers 구조 (label이 별도 열)
  const rowColCount = 1 + (rows[0]?.cells.length ?? 0);
  const useLeadingLabel = headers.length < rowColCount;

  return (
    <div className="my-6 overflow-x-auto rounded-lg border border-cream-dark">
      <table className="w-full min-w-[480px] border-collapse text-sm">
        <thead>
          <tr className="bg-cream-dark">
            {useLeadingLabel && (
              <th className="px-4 py-3 text-left font-semibold text-text-primary" />
            )}
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
              {useLeadingLabel ? (
                <>
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
                </>
              ) : (
                <>
                  <td className="px-4 py-3 font-medium text-text-primary">
                    {row.label}
                  </td>
                  {row.cells.map((cell, ci) => (
                    <td
                      key={ci}
                      className="px-4 py-3 text-text-secondary"
                      style={
                        highlight === (ci + 1)
                          ? { backgroundColor: "var(--color-accent-light)" }
                          : undefined
                      }
                    >
                      {cell}
                    </td>
                  ))}
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
