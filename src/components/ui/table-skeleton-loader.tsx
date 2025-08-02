import React from 'react';
import { TableCell, TableRow } from './table';
import { Skeleton } from './skeleton';

export interface TableSkeletonLoaderProps {
  rowCount?: number;
  columnCount?: number;
  columns?: Array<{
    width?: string;
    height?: string;
    shape?: string;
    cellClassName?: string;
  }>;
  defaultColumnConfig?: {
    width?: string;
    height?: string;
    shape?: string;
    cellClassName?: string;
  };
}

const fallbackDefaultColumns = [
  { width: 'w-12', height: 'h-12', shape: 'rounded-md', cellClassName: 'py-2 px-4' },
  { width: 'w-48', height: 'h-6', shape: 'rounded-md', cellClassName: 'py-2 px-4' },
  { width: 'w-32', height: 'h-6', shape: 'rounded-md', cellClassName: 'hidden sm:table-cell py-2 px-4' },
  { width: 'w-48', height: 'h-6', shape: 'rounded-md', cellClassName: 'hidden md:table-cell py-2 px-4' },
  { width: 'w-32', height: 'h-6', shape: 'rounded-md', cellClassName: 'hidden lg:table-cell py-2 px-4' },
  { width: 'w-24', height: 'h-6', shape: 'rounded-md', cellClassName: 'py-2 px-4' },
  { width: 'w-32', height: 'h-6', shape: 'rounded-md', cellClassName: 'hidden sm:table-cell py-2 px-4' },
  { width: 'w-24', height: 'h-6', shape: 'rounded-md', cellClassName: 'hidden md:table-cell py-2 px-4' },
  { width: 'w-16', height: 'h-6', shape: 'rounded-md', cellClassName: 'py-6 px-4' },
];

export const TableSkeletonLoader: React.FC<TableSkeletonLoaderProps> = ({
  rowCount = 10,
  columnCount,
  columns,
  defaultColumnConfig = { width: 'w-32', height: 'h-6', shape: 'rounded-md', cellClassName: 'py-2 px-4' },
}) => {
  let columnsToRender: Array<{
    width?: string;
    height?: string;
    shape?: string;
    cellClassName?: string;
  }>;

  if (columns && columns.length > 0) {
    columnsToRender = columns;
  } else if (columnCount !== undefined && columnCount > 0) {
    columnsToRender = Array(columnCount).fill(defaultColumnConfig);
  } else {
    columnsToRender = fallbackDefaultColumns;
  }

  return (
    <>
      {Array(rowCount)
        .fill(0)
        .map((_, rowIndex) => (
          <TableRow key={rowIndex} className="border-b border-gray-200 dark:border-gray-700 animate-pulse">
            {columnsToRender.map((column, colIndex) => (
              <TableCell key={colIndex} className={column.cellClassName || ''}>
                <Skeleton
                  className={`${column.height || 'h-6'} ${column.width || 'w-32'} ${column.shape || 'rounded-md'} bg-gray-200 dark:bg-gray-700`}
                />
              </TableCell>
            ))}
          </TableRow>
        ))}
    </>
  );
};