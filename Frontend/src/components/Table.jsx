import React from "react";

export default function Table({ columns = [], data = [] }) {
  console.log(data, columns);
  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="min-w-full divide-y">
        {/* Table Header */}
        <thead className="bg-gray-50">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className="px-4 py-3 text-left text-sm font-medium text-gray-700"
              >
                {col.title}
              </th>
            ))}
          </tr>
        </thead>

        {/* Table Body */}
        <tbody className="divide-y">
          {data && data.length > 0 ? (
            data.map((row, rowIndex) => (
              <tr
                key={row.id || rowIndex} // prefer unique row id, fallback to index
                className="hover:bg-gray-50"
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className="px-4 py-3 text-sm text-gray-600"
                  >
                    {typeof col.render === "function"
                      ? col.render(row)
                      : row[col.key] ?? "-"} {/* fallback to "-" if value undefined */}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={columns.length}
                className="px-4 py-8 text-center text-gray-500"
              >
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
