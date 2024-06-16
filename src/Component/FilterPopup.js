import React, { useState, useEffect, useRef } from "react";
import { Close } from "@mui/icons-material";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import DashboardIcon from "@mui/icons-material/Dashboard";
import { MenuItem, Select, FormControl, TextField, Chip } from "@mui/material";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import DoneIcon from "@mui/icons-material/Done";

const FilterPopup = ({ isOpen, data, onClose, onApplyFilters }) => {
  const [selectedSection, setSelectedSection] = useState("scheduledDate");
  const [dateFilter, setDateFilter] = useState("All time");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const mockUsers = data;
  const [searchOption, setSearchOption] = useState("name");
  const [searchName, setSearchName] = useState("");
  const [filteredNames, setFilteredNames] = useState([]);
  const [serviceType, setServiceType] = useState("");
  const [status, setStatus] = useState("");
  const serviceTypes = [
    "Show all service type ",
    "Class",
    "Appointment",
    "Facility",
    "Class Pack",
    "Membership",
    "General items",
  ];
  const statuses = ["Show all", "Public", "Private", "Disable", "Draft"];

  const [appliedFilters, setAppliedFilters] = useState([]);

  const handleSectionClick = (section) => {
    setSelectedUsers([]);
    setFilteredNames([]);
    setSelectedSection(section);
  };

  const handleDateFilterChange = (event) => {
    const selectedFilter = event.target.value;
    setDateFilter(selectedFilter);
    handleDateRangeChange(selectedFilter);
  };

  const handleDateRangeChange = (selectedFilter) => {
    const today = new Date();
    let newStartDate = new Date();
    let newEndDate = new Date();

    switch (selectedFilter) {
      case "All time":
        newStartDate = today;
        newEndDate = today;
        break;
      case "Custom":
        newStartDate = today;
        newEndDate = today;
        break;
      case "Last 30 days":
        newStartDate = new Date(today);
        newStartDate.setDate(today.getDate() - 30);
        newEndDate = today;
        break;
      case "This month":
        newStartDate = new Date(today.getFullYear(), today.getMonth(), 1);
        newEndDate = today;
        break;
      case "Last month":
        newStartDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        newEndDate = new Date(today.getFullYear(), today.getMonth(), 0);
        break;
      case "This quarter":
        const currentMonth = today.getMonth();
        const quarterStartMonth = currentMonth - (currentMonth % 3);
        newStartDate = new Date(today.getFullYear(), quarterStartMonth, 1);
        newEndDate = today;
        break;
      case "2 quarters ago":
        const twoQuartersAgoStartMonth = today.getMonth() - 6;
        newStartDate = new Date(
          today.getFullYear(),
          twoQuartersAgoStartMonth,
          1
        );
        newEndDate = new Date(today.getFullYear(), today.getMonth() - 3, 0);
        break;
      default:
        newStartDate = today;
        newEndDate = today;
    }

    setStartDate(newStartDate);
    setEndDate(newEndDate);
  };

  const handleSearchInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredUsers = mockUsers.filter((user) =>
    user.payer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUserSelect = (user) => {
    const isSelected = selectedUsers.some((u) => u.payer === user.payer);
    if (isSelected) {
      setSelectedUsers(selectedUsers.filter((u) => u.payer !== user.payer));
    } else {
      setSelectedUsers([...selectedUsers, user]);
    }
  };

  const handleSearchNameChange = (event) => {
    setSearchName(event.target.value);
    const filtered = mockUsers.filter((user) =>
      user.payer.toLowerCase().includes(event.target.value.toLowerCase())
    );
    setFilteredNames(filtered);
  };

  const popupRef = useRef(null);

  // Close the popup when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Function to apply filters
  const applyFilters = () => {
    // Construct filter object based on selected criteria
    const appliedFilter = {
      section: selectedSection,
      dateFilter,
      startDate,
      endDate,
      searchTerm,
      selectedUsers,
      searchOption,
      searchName,
      serviceType,
      status,
    };

    // Add to appliedFilters state
    setAppliedFilters([...appliedFilters, appliedFilter]);

    // Call parent component's onApplyFilters with applied filters
    onApplyFilters(appliedFilter);

    // Close the popup
    onClose();
  };

  return (
    <div
      className={`fixed inset-0 z-10  overflow-y-auto ${
        isOpen ? "block" : "hidden"
      }`}
    >
      <div className="fixed inset-0 bg-black opacity-50"></div>
      <div className="flex justify-center items-center min-h-screen">
        <div className="bg-white rounded-lg shadow-lg w-full md:max-w-3xl lg:max-w-4xl relative">
          {/* Header */}
          <div className="flex justify-between items-center px-6 py-4 border-b">
            <h2 className="text-lg font-semibold">Add Filters</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-800 focus:outline-none"
            >
              <Close />
            </button>
          </div>

          {/* Body */}
          <div className="flex">
            {/* Left Side */}
            <div className="w-1/3 bg-gray-100 p-4">
              {/* Section 1: Scheduled Date */}
              <div
                className={`cursor-pointer mb-4 p-4 rounded-md ${
                  selectedSection === "scheduledDate" ? "bg-gray-200" : ""
                }`}
                onClick={() => handleSectionClick("scheduledDate")}
              >
                <CalendarTodayIcon className="h-6 w-6 mr-2 inline-block" />
                Scheduled Date
              </div>

              {/* Section 2: People */}
              <div
                className={`cursor-pointer mb-4 p-4 rounded-md ${
                  selectedSection === "people" ? "bg-gray-200" : ""
                }`}
                onClick={() => handleSectionClick("people")}
              >
                <PeopleAltIcon className="h-6 w-6 mr-2 inline-block" />
                People
              </div>

              {/* Section 3: Services/Products */}
              <div
                className={`cursor-pointer mb-4 p-4 rounded-md ${
                  selectedSection === "servicesProducts" ? "bg-gray-200" : ""
                }`}
                onClick={() => handleSectionClick("servicesProducts")}
              >
                <DashboardIcon className="h-6 w-6 mr-2 inline-block" />
                Services/Products
              </div>
            </div>

            {/* Right Side */}
            <div className="flex-1 p-4">
              {/* Conditionally show content based on selectedSection */}
              {selectedSection === "scheduledDate" && (
                <div className="bg-white rounded-lg shadow-lg p-6">
                  {/* Content for Scheduled Date section */}
                  {/* Dropdown for date filter */}
                  <div className="mb-4">
                    <FormControl fullWidth>
                      <label>Show Orders For</label>
                      <Select
                        value={dateFilter}
                        onChange={handleDateFilterChange}
                        fullWidth
                      >
                        <MenuItem value="All time">All time</MenuItem>
                        <MenuItem value="Custom">Custom</MenuItem>
                        <MenuItem value="Last 30 days">Last 30 days</MenuItem>
                        <MenuItem value="This month">This month</MenuItem>
                        <MenuItem value="Last month">Last month</MenuItem>
                        <MenuItem value="This quarter">This quarter</MenuItem>
                        <MenuItem value="2 quarters ago">
                          2 quarters ago
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </div>

                  {/* Calendar pickers */}
                  {dateFilter === "Custom" && (
                    <div className="mb-4 flex items-center">
                      <div className="flex flex-col mr-4">
                        <label className="text-sm font-medium text-gray-600 mb-1">
                          From
                        </label>
                        <div className="flex items-center">
                          <CalendarTodayIcon className="mr-2" />
                          <DatePicker
                            selected={startDate}
                            onChange={(date) => setStartDate(date)}
                            className="form-control"
                            placeholderText="From"
                          />
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-600 mb-1">
                          To
                        </label>
                        <div className="flex items-center">
                          <CalendarTodayIcon className="mr-2" />
                          <DatePicker
                            selected={endDate}
                            onChange={(date) => setEndDate(date)}
                            className="form-control"
                            placeholderText="To"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {selectedSection === "people" && (
                <div className="bg-white rounded-lg shadow-lg p-6">
                  {/* Content for People section */}
                  <div className="mb-4">
                    <TextField
                      placeholder="Search Payer or attendee name"
                      variant="outlined"
                      fullWidth
                      value={searchTerm}
                      onChange={handleSearchInputChange}
                      className="mb-4"
                    />
                    {searchTerm ? (
                      <>
                        <p>
                          Showing{" "}
                          <span className="font-bold">
                            {filteredUsers.length}
                          </span>{" "}
                          results matching{" "}
                          <span className="font-bold">{searchTerm}</span>
                        </p>
                        <div className="max-h-64 overflow-y-auto custom-scrollbar">
                          {filteredUsers.length > 0 ? (
                            filteredUsers.map((user) => (
                              <div
                                key={user.payer}
                                className="flex items-center mb-2"
                              >
                                <input
                                  type="checkbox"
                                  checked={selectedUsers.some(
                                    (u) => u.payer === user.payer
                                  )}
                                  onChange={() => handleUserSelect(user)}
                                  className="mr-2"
                                />
                                   <span>{user.payer}</span>
                                   <span className="tag">{user.tag}</span>
                              </div>
                            ))
                          ) : (
                            <p>No results found</p>
                          )}
                        </div>
                      </>
                    ) : (
                      <></>
                    )}
                  </div>
                </div>
              )}

              {selectedSection === "servicesProducts" && (
                <div className="bg-white rounded-lg shadow-lg p-6">
                  {/* Content for Services/Products section */}
                  <div className="flex items-center mb-4">
                    <label className="mr-4">
                      <input
                        type="radio"
                        name="searchOption"
                        value="name"
                        checked={searchOption === "name"}
                        onChange={(e) => setSearchOption(e.target.value)}
                        className="mr-2"
                      />
                      Search by Name
                    </label>
                    <label>
                      <input
                        type="radio"
                        name="searchOption"
                        value="tag"
                        checked={searchOption === "tag"}
                        onChange={(e) => setSearchOption(e.target.value)}
                        className="mr-2"
                      />
                      Search by Tag
                    </label>
                  </div>
                  {searchOption === "name" && (
                    <div className="mb-4">
                      <TextField
                        placeholder="Search by Name"
                        variant="outlined"
                        fullWidth
                        value={searchName}
                        onChange={handleSearchNameChange}
                        className="mb-4"
                      />
                      {searchName ? (
                        <>
                          <p>
                            Showing{" "}
                            <span className="font-bold">
                              {filteredNames.length}
                            </span>{" "}
                            results matching{" "}
                            <span className="font-bold">{searchName}</span>
                          </p>
                          <div className="max-h-64 overflow-y-auto custom-scrollbar">
                            {filteredNames.length > 0 ? (
                              filteredNames.map((user) => (
                                <div
                                  key={user.payer}
                                  className="flex items-center mb-2"
                                >
                                  <input
                                    type="checkbox"
                                    checked={selectedUsers.some(
                                      (u) => u.payer === user.payer
                                    )}
                                    onChange={() => handleUserSelect(user)}
                                    className="mr-2"
                                  />
                            <div className="flex justify-between items-center w-full">
          <span>{user.payer}</span>
          <div className="flex items-center space-x-1">
            <span className={`chip-type ${user.type === 'class' ? 'green' : 'mustard'}`}>{user.type === 'class' ? 'Class' : 'Facility'}</span>
            <span className="chip-status">{user.status}</span>
          </div>
        </div>
                                </div>
                              ))
                            ) : (
                              <p>No results found</p>
                            )}
                          </div>
                        </>
                      ) : (
                        <></>
                      )}
                    </div>
                  )}
                  {searchOption === "tag" ? (
                    <div className="mb-4">
                      <FormControl fullWidth className="mb-4 p-1">
                        <label>Service Type</label>
                        <Select
                          value={serviceType}
                          onChange={(event) =>
                            setServiceType(event.target.value)
                          }
                          fullWidth
                          renderValue={(selected) => selected}
                          inputProps={{
                            style: {
                              paddingRight: 0,
                              pointerEvents: "none",
                            },
                          }}
                        >
                          {serviceTypes.map((type) => (
                            <MenuItem
                              key={type}
                              value={type}
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                              }}
                            >
                              {type}
                              {serviceType === type && (
                                <DoneIcon className="ml-2" />
                              )}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      <FormControl fullWidth className="mb-4 p-1">
                        <label>Status</label>
                        <Select
                          value={status}
                          onChange={(event) => setStatus(event.target.value)}
                          fullWidth
                          renderValue={(selected) => selected}
                          inputProps={{
                            style: {
                              paddingRight: 0,
                              pointerEvents: "none",
                            },
                          }}
                        >
                          {statuses.map((stat) => (
                            <MenuItem
                              key={stat}
                              value={stat}
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                              }}
                            >
                              {stat}
                              {status === stat && <DoneIcon className="ml-2" />}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </div>
                  ) : (
                    <></>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end px-6 py-4 border-t">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 rounded-md text-gray-700 hover:bg-gray-300 mr-3"
            >
              Reset to Default
            </button>
            <button
              onClick={applyFilters}
              className="px-4 py-2 bg-black rounded-md text-white hover:bg-gray-900"
            >
              Apply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterPopup;

