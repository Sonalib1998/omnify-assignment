import React, { useState } from "react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  CalendarIcon,
  UserCircleIcon,
  FilterIcon,
  SearchIcon,
  RefreshIcon,
  DownloadIcon,
} from "@heroicons/react/outline";
import ViewWeekOutlinedIcon from "@mui/icons-material/ViewWeekOutlined";
import FilterPopup from "./FilterPopup";
const data = Array.from({ length: 50 }, (_, index) => {
  const tag = Math.random() < 0.5 ? "attendee" : "payer";
  const type = Math.random() < 0.5 ? "class" : "facility";

  return {
    createdOn: `Sun 07 Jan 2024 ${index + 2}:42pm`,
    payer: `Payer ${index + 1}`,
    attendee: `Attendee ${index + 1}`,
    status: index % 3 === 0 ? "Lead" : index % 3 === 1 ? "Active" : "Inactive",
    email: `payer${index + 1}@gmail.com`,
    payerPhone: `+91 98979656${index < 10 ? `0${index}` : index}`,
    services: `Service ${index + 1}`,
    scheduled: `Sun 07 Jan 2024 ${index + 3}:42pm`,
    type: type,
    tag: tag,
  };
});
const ColumnDropdown = ({ columns, handleColumnChange, handleClose }) => {
  const handleApply = () => {
    handleClose();
    handleColumnChange(columns);
  };

  const handleReset = () => {
    const resetColumns = columns.map((col) => ({ ...col, visible: true }));
    handleColumnChange(resetColumns);
    handleClose();
  };

  const toggleColumnVisibility = (columnName) => {
    const updatedColumns = columns.map((col) =>
      col.name === columnName ? { ...col, visible: !col.visible } : col
    );
    handleColumnChange(updatedColumns);
  };
  return (
    <div className="absolute right-0 top-4 w-100 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none p-5 max-h-80 overflow-y-auto custom-scrollbar">
      <div
        className="py-2"
        role="menu"
        aria-orientation="vertical"
        aria-labelledby="options-menu"
      >
        <div className="flex items-center mb-3">
          <label className="text-black font-bold">Edit Columns</label>
        </div>
        <p className="text-gray-700 mb-3">
          Please select the columns to rearrange
        </p>
        {columns.map((col) => (
          <div
            key={col.name}
            className="flex border p-2 items-center mb-2 last:mb-0"
          >
            <input
              type="checkbox"
              id={col.name}
              checked={col.visible}
              onChange={() => toggleColumnVisibility(col.name)}
              className="mr-2 text-black border border-gray-300 rounded-md w-5 h-5 flex-shrink-0"
            />
            <label htmlFor={col.name} className="text-gray-700 cursor-pointer">
              {col.name}
            </label>
          </div>
        ))}
        <div className="flex justify-end mt-4">
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-gray-200 rounded-md text-gray-700 hover:bg-gray-300 mr-3"
          >
            Reset to Default
          </button>
          <button
            onClick={handleApply}
            className="px-4 py-2 bg-black rounded-md text-white hover:bg-gray-900"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};

export default function Waitlist() {
  const [columns, setColumns] = useState([
    { name: "Created On", key: "createdOn", visible: true, icon: CalendarIcon },
    { name: "Payer", key: "payer", visible: true, icon: UserCircleIcon },
    { name: "Status", key: "status", visible: true, icon: null },
    { name: "Email", key: "email", visible: true, icon: null },
    { name: "Payer Phone", key: "payerPhone", visible: true, icon: null },
    { name: "Services", key: "services", visible: true, icon: null },
    { name: "Scheduled", key: "scheduled", visible: true, icon: CalendarIcon },
  ]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState([]);
  const [showColumnDropdown, setShowColumnDropdown] = useState(false);
  const [showFilterPopup, setShowFilterPopup] = useState(false);
  const rowsPerPage = 7;
  const handleColumnChange = (updatedColumns) => {
    setColumns(updatedColumns);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleRowCheckboxChange = (rowIndex) => {
    const selectedIndex = selectedRows.indexOf(rowIndex);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selectedRows, rowIndex);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selectedRows.slice(1));
    } else if (selectedIndex === selectedRows.length - 1) {
      newSelected = newSelected.concat(selectedRows.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selectedRows.slice(0, selectedIndex),
        selectedRows.slice(selectedIndex + 1)
      );
    }

    setSelectedRows(newSelected);
  };

  const handleSelectAllClick = (checked) => {
    if (checked) {
      const newSelecteds = paginatedData.map(
        (_, index) => (currentPage - 1) * rowsPerPage + index
      );
      setSelectedRows(selectedRows.concat(newSelecteds));
    } else {
      const newSelecteds = selectedRows.filter(
        (index) =>
          !(
            index >= (currentPage - 1) * rowsPerPage &&
            index < currentPage * rowsPerPage
          )
      );
      setSelectedRows(newSelecteds);
    }
  };

  const [appliedFilters, setAppliedFilters] = useState([]);

  const handleApplyFilters = (appliedFilter) => {
    setAppliedFilters([...appliedFilters, appliedFilter]);
  };

  const paginatedData = data.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );
  const pageCount = Math.ceil(data.length / rowsPerPage);

  const totalDataCount = data.length;

  const isSelected = (rowIndex) => selectedRows.indexOf(rowIndex) !== -1;

  const allRowsSelected =
    paginatedData.length > 0 &&
    paginatedData.every((_, index) =>
      isSelected((currentPage - 1) * rowsPerPage + index)
    );

  const getStatusStyle = (status) => {
    switch (status) {
      case "Lead":
        return "bg-blue-100 text-blue-600";
      case "Active":
        return "bg-green-100 text-green-600";
      case "Inactive":
        return "bg-gray-200 text-gray-600";
      default:
        return "";
    }
  };

  const getStatusTextStyle = (status) => {
    switch (status) {
      case "Lead":
        return "text-blue-600";
      case "Active":
        return "text-green-600";
      case "Inactive":
        return "text-gray-600";
      default:
        return "";
    }
  };

  const toggleColumnDropdown = () => {
    setShowColumnDropdown(!showColumnDropdown);
  };
  const toggleFilterPopup = () => {
    setShowFilterPopup(!showFilterPopup);
  };
  function formatDate(date) {
    const d = new Date(date);
    const day = d.getDate().toString().padStart(2, "0");
    const month = (d.getMonth() + 1).toString().padStart(2, "0");
    const year = d.getFullYear();

    return `${day}-${month}-${year}`;
  }
  return (
    <div className="max-w-full mx-auto bg-white p-6 rounded-lg shadow-lg overflow-x-auto relative">
      <div className="mb-4">
        <h2 className="text-lg font-bold text-gray-800 mb-2">Waitlisted</h2>
        <div className="flex space-x-4">
          <div className="flex-1 p-3 rounded-lg border border-gray-300">
            <div>
              All Waitlists <span className="text-gray-700">100</span>
            </div>
          </div>
          <div className="flex-1 p-3 rounded-lg border border-gray-300">
            <div>
              Newly added <span className="text-gray-700">50</span>
            </div>
          </div>
          <div className="flex-1 p-3 rounded-lg border border-gray-300">
            <div>
              Leads <span className="text-gray-700">20</span>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-between mb-4">
        <div className="flex items-center space-x-4">
          <button
            className="px-3 py-1 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 flex items-center space-x-1"
            onClick={toggleFilterPopup}
          >
            <FilterIcon className="w-5 h-5" />
            <span>Add Filter</span>
          </button>
          {showFilterPopup && (
            <FilterPopup
              onApplyFilters={handleApplyFilters}
              isOpen={showFilterPopup}
              data={data}
              onClose={toggleFilterPopup}
              appliedFilters={appliedFilters}
            />
          )}

          {/* Applied Filters (Chips) */}
          <div className="flex items-center space-x-2 ml-4">
            {appliedFilters.map((filter, index) => (
              <div key={index} className="chip">
                {filter.section === "scheduledDate" ? (
                  <div className="chip-item">
                    {formatDate(filter.startDate)} -{" "}
                    {formatDate(filter.endDate)}
                  </div>
                ) : (
                  filter.selectedUsers &&
                  filter.selectedUsers.map((user, userIndex) => (
                    <div key={userIndex} className="chip-item">
                      {user.payer}
                    </div>
                  ))
                )}
                <button
                  onClick={() => {
                    // Remove filter from appliedFilters
                    const updatedFilters = appliedFilters.filter(
                      (f, idx) => idx !== index
                    );
                    setAppliedFilters(updatedFilters);
                  }}
                  className="chip-remove"
                >
                  x
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search client"
              className="pl-8 pr-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            <SearchIcon className="absolute left-2 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
          <button className="px-3 py-1 bg-white rounded-md text-gray-700 hover:bg-gray-100">
            <RefreshIcon className="w-5 h-5" />
          </button>
          <button
            className="px-3 py-1 bg-white rounded-md text-gray-700 hover:bg-gray-100"
            onClick={toggleColumnDropdown}
          >
            <ViewWeekOutlinedIcon className="w-5 h-5" />
          </button>
          {showColumnDropdown && (
            <ColumnDropdown
              columns={columns}
              handleColumnChange={handleColumnChange}
              handleClose={toggleColumnDropdown}
            />
          )}
          <button className="px-3 py-1 bg-white rounded-md text-gray-700 hover:bg-gray-100">
            <DownloadIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-2 px-4 border-b border-gray-300 text-left font-semibold text-gray-700">
              <input
                type="checkbox"
                checked={allRowsSelected}
                onChange={(e) => handleSelectAllClick(e.target.checked)}
                className="mr-2"
              />
            </th>
            {columns.map(
              (col) =>
                col.visible && (
                  <th
                    key={col.name}
                    className="py-2 px-4 border-b border-gray-300 text-left font-semibold text-gray-700"
                  >
                    {col.icon ? (
                      <col.icon className="inline-block w-5 h-5 mr-2 text-gray-500" />
                    ) : (
                      "#"
                    )}
                    {col.name}
                  </th>
                )
            )}
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className={`hover:bg-gray-50 ${
                isSelected((currentPage - 1) * rowsPerPage + rowIndex)
                  ? "bg-gray-200"
                  : ""
              }`}
            >
              <td className="py-2 px-4 border-b border-gray-300">
                <input
                  type="checkbox"
                  checked={isSelected(
                    (currentPage - 1) * rowsPerPage + rowIndex
                  )}
                  onChange={() =>
                    handleRowCheckboxChange(
                      (currentPage - 1) * rowsPerPage + rowIndex
                    )
                  }
                />
              </td>
              {columns.map(
                (col) =>
                  col.visible && (
                    <td
                      key={col.name}
                      className={`py-2 px-4 border-b border-gray-300`}
                    >
                      {col.key === "status" ? (
                        <span
                          className={`inline-block px-2 py-1 rounded-full ${getStatusStyle(
                            row[col.key]
                          )}`}
                        >
                          <span
                            className={`inline-block w-2 h-2 rounded-full mr-2 ${
                              row[col.key] === "Lead"
                                ? "bg-blue-600"
                                : row[col.key] === "Active"
                                ? "bg-green-600"
                                : "bg-gray-600"
                            }`}
                          ></span>
                          <span
                            className={`text-center ${getStatusTextStyle(
                              row[col.key]
                            )}`}
                          >
                            {row[col.key]}
                          </span>
                        </span>
                      ) : (
                        row[col.key]
                      )}
                    </td>
                  )
              )}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-4 flex justify-between items-center">
        <div className="text-gray-700">
          Displaying {rowsPerPage} of {totalDataCount} entries
        </div>
        <div className="flex space-x-2">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handlePageChange(currentPage - 1);
            }}
            className={`flex items-center px-3 py-1 text-gray-700 rounded-md ${
              currentPage === 1
                ? "opacity-50 cursor-default"
                : "hover:bg-gray-200"
            }`}
          >
            <ChevronLeftIcon className="h-4 w-4 mr-1" />
            Previous
          </a>
          {Array.from({ length: pageCount }, (_, index) => (
            <a
              key={index}
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handlePageChange(index + 1);
              }}
              className={`flex items-center px-3 py-1 text-gray-700 rounded-md ${
                currentPage === index + 1 ? "bg-gray-200" : "hover:bg-gray-200"
              }`}
            >
              {index + 1}
            </a>
          ))}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handlePageChange(currentPage + 1);
            }}
            className={`flex items-center px-3 py-1 text-gray-700 rounded-md ${
              currentPage === pageCount
                ? "opacity-50 cursor-default"
                : "hover:bg-gray-200"
            }`}
          >
            Next
            <ChevronRightIcon className="h-4 w-4 ml-1" />
          </a>
        </div>
      </div>
    </div>
  );
}
