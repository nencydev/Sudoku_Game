// sudoku-game/src/components/SudokuCell.jsx
import React from "react";

function SudokuCell({ value, row, col, onChange, readOnly, hasError, isUserInput }) {
  const getBorderClass = () => {
    let borderClass = "";
    if (col % 3 === 0) borderClass += " border-l-4";
    if (row % 3 === 0) borderClass += " border-t-4";
    if (col === 8) borderClass += " border-r-4";
    if (row === 8) borderClass += " border-b-4";
    return borderClass;
  };

  return (
    <input
      type="text"
      maxLength="1"
      value={value === 0 ? "" : value}
      onChange={(e) => onChange(row, col, e.target.value)}
      readOnly={readOnly}
      className={`
        w-10 h-10 text-center text-lg font-bold outline-none border border-gray-50
        ${getBorderClass()}
        ${readOnly ? "bg-gray-200 text-black" : "bg-white"}
        ${hasError ? "text-red-700" : ""}
        ${isUserInput && !hasError ? "text-blue-600" : ""}
      `}
    />
  );
}

export default SudokuCell;
