import { useState } from "react";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";

interface Column<T> {
  header: string;
  accessor: keyof T | ((item: T) => React.ReactNode);
  cell?: (item: T) => React.ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  isLoading?: boolean;
  actions?: (item: T) => React.ReactNode;
}

const DataTable = <T extends object>({
  data,
  columns,
  isLoading = false,
  actions,
}: DataTableProps<T>) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredData = data.filter((item) => {
    return Object.values(item).some((value) =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const renderCell = (item: T, column: Column<T>) => {
    if (column.cell) {
      return column.cell(item);
    }

    if (typeof column.accessor === "function") {
      return column.accessor(item);
    }

    const value = item[column.accessor as keyof T];
    return String(value);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 border-b">
        <input
          type="text"
          placeholder="Search..."
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="overflow-x-auto">
        <Table className="w-full whitespace-nowrap">
          <TableHeader className="bg-gray-50">
            <TableRow>
              {columns.map((column, index) => (
                <TableHead
                  key={index}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {column.header}
                </TableHead>
              ))}
              {actions && <TableHead className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-gray-200">
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length + (actions ? 1 : 0)}
                  className="px-6 py-4 text-center text-gray-500"
                >
                  Loading...
                </TableCell>
              </TableRow>
            ) : filteredData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length + (actions ? 1 : 0)}
                  className="px-6 py-4 text-center text-gray-500"
                >
                  No data found
                </TableCell>
              </TableRow>
            ) : (
              filteredData.map((item, rowIndex) => (
                <TableRow
                  key={rowIndex}
                  className="hover:bg-gray-50 transition-colors"
                >
                  {columns.map((column, colIndex) => (
                    <TableCell key={colIndex} className="px-6 py-4">
                      {renderCell(item, column)}
                    </TableCell>
                  ))}
                  {actions && (
                    <TableCell className="px-6 py-4">
                      {actions(item)}
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default DataTable;